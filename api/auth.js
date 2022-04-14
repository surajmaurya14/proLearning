const express = require("express");
const router = express.Router();
const path = require("path");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
    hashPassword,
    comparePassword,
} = require("../utils-server/authentication");
const sendEmail = require("../utils-server/sendEmail");
const readHTML = require("../utils-server/readHTML");

// @route       : POST /api/user/login
// @description : User login
router.post("/login", async (req, res) => {
    try {
        let { email, password, rememberMe } = req.body;
        if (
            email == undefined ||
            password == undefined ||
            password.length < 6 ||
            password.length > 64
        ) {
            return res.status(400).json({ success: false });
        }
        let user = await User.findOne({ email });
        if (user) {
            if (await comparePassword(password, user.password)) {
                if (user.account_verified === false) {
                    return res
                        .status(200)
                        .json({ success: false, account_verified: false });
                }
                const { first_name, last_name, email, role, newsletter } = user;
                let data = {
                    first_name,
                    last_name,
                    email,
                    role,
                    newsletter,
                };
                let expireTime = "12h";
                if (rememberMe) {
                    expireTime = "7d";
                }
                const token = jwt.sign(
                    { _id: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: expireTime }
                );
                res.cookie("token", token, {
                    httpOnly: true,
                    // secure: true,
                });
                return res.status(200).json({ success: true, user: data });
            }
        }
        return res.status(400).json({ success: false });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/user/register
// @description : User registration
router.post("/register", async (req, res) => {
    try {
        let { first_name, last_name, email, password, newsletter } = req.body;
        if (
            first_name === undefined ||
            last_name === undefined ||
            email === undefined ||
            password === undefined ||
            password.length < 6 ||
            password.length > 64
        ) {
            return res.status(400).json({ success: false });
        }
        let user = await User.findOne({ email });
        if (user !== null && user.account_verified === true) {
            return res.status(200).json({
                success: false,
            });
        }
        if (
            user !== null &&
            user.account_verified === false &&
            user.verification_token_expiry_date - Date.now() > 0
        ) {
            return res.status(200).json({
                success: false,
                time: Math.ceil(
                    (user.verification_token_expiry_date - Date.now()) /
                        1000 /
                        60
                ),
            });
        }
        const hash = await hashPassword(password);
        const randomCode = nanoid(8);
        if (user !== null) {
            user.first_name = first_name;
            user.last_name = last_name;
            user.newsletter = newsletter;
            user.password = hash;
            user.account_verification_token = randomCode;
            user.verification_token_expiry_date = Date.now() + 1000 * 60 * 10;
            await user.save();
        } else {
            user = await User.create({
                first_name,
                last_name,
                email,
                password: hash,
                newsletter,
                account_verification_token: randomCode,
                verification_token_expiry_date: Date.now() + 1000 * 60 * 10,
            });
        }
        await sendEmail({
            to: user.email,
            subject: "proLearning Account Activation",
            html: await readHTML(
                path.join(__dirname, "../emails/verify-account.ejs"),
                { first_name, email, token: randomCode }
            ),
        });
        return res.status(200).json({ success: true });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/user/logout
// @description : Clear cookie on logout
router.post("/logout", async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ success: true });
});

// @route       : GET /api/user/activate
// @description : Account activation from email
router.get("/activate", async (req, res) => {
    try {
        const { email, account_verification_token } = req.query;
        const user = await User.findOne({
            email,
            account_verification_token,
        });
        if (user === null) {
            return res.redirect(`${process.env.DOMAIN}/user/register`);
        } else {
            if (Date.now() - user.verification_token_expiry_date >= 0) {
                return res.redirect(`${process.env.DOMAIN}/user/register`);
            } else {
                user.verification_token_expiry_date = null;
                user.account_verified = true;
                user.account_verification_token = "";
                await user.save();
                return res.redirect(`${process.env.DOMAIN}/user/login`);
            }
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return;
    }
});

// @route       : POST /api/user/reset-password-token
// @description : Account password reset request from a non-loggedin user
router.post("/reset-password-token", async (req, res) => {
    try {
        const { email } = req.body;
        const randomCode = nanoid(8);

        const user = await User.findOne({ email });
        if (user === null) {
            return res.status(400).json({
                success: false,
            });
        }
        if (
            user.reset_token_expiry_date !== null &&
            user.reset_token_expiry_date - Date.now() > 0
        ) {
            return res.status(200).json({
                success: false,
                time: Math.ceil(
                    (user.reset_token_expiry_date - Date.now()) / 1000 / 60
                ),
            });
        } else {
            user.password_reset_token = randomCode;
            user.reset_token_expiry_date = Date.now() + 1000 * 60 * 5;
            await user.save();
            await sendEmail({
                to: email,
                subject: "Password Reset Token",
                html: await readHTML(
                    path.join(__dirname, "../emails/reset-password.ejs"),
                    { token: randomCode, first_name: user.first_name }
                ),
            });
            return res.status(200).json({ success: true });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/user/reset-password-token
// @description : Account password change request from a non-loggedin user
router.post("/change-password", async (req, res) => {
    try {
        const { email, password_reset_token, password } = req.body;
        let hash = await hashPassword(password);

        const user = await User.findOneAndUpdate(
            { email, password_reset_token },
            {
                password: hash,
                password_reset_token: "",
                reset_token_expiry_date: "",
            }
        );
        if (user === null) {
            return res.status(400).json({ success: false });
        }
        return res.status(200).json({ success: true });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

module.exports = router;
