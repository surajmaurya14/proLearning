const express = require("express");
const router = express.Router();

const { getUser, isInstructor } = require("../../middlewares/verification");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const queryString = require("query-string");
const User = require("../../models/User");

router.use("/course", require("./course"));

// @route       : POST /api/instructor
// @description : If stripe connect account not present, create it for user and send back onboarding url
router.post("/", getUser, async (req, res) => {
    try {
        if (!req.user.stripe_account_id) {
            const account = await stripe.accounts.create({ type: "standard" });
            req.user.stripe_account_id = account.id;
            req.user.save();
        }
        let accountLink = await stripe.accountLinks.create({
            account: req.user.stripe_account_id,
            refresh_url: process.env.STRIPE_REDIRECT_URL,
            return_url: process.env.STRIPE_REDIRECT_URL,
            type: "account_onboarding",
        });

        accountLink = Object.assign(accountLink, {
            "stripe_user[email]": req.user.email,
        });

        return res.status(200).json({
            success: true,
            url: `${accountLink.url}?${queryString.stringify(accountLink)}`,
        });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : GET /api/instructor/account-data
// @description : After receiving stripe callback, update User model
router.get("/account-data", getUser, async (req, res) => {
    try {
        const account = await stripe.accounts.retrieve(
            req.user.stripe_account_id
        );
        if (!account.charges_enabled) {
            return res.status(401).json({ success: "false" });
        } else {
            const updatedUserData = await User.findByIdAndUpdate(
                req.user._id,
                {
                    stripe_instructor: account,
                    $addToSet: { role: "Instructor" },
                },
                { new: true }
            );
            const { first_name, last_name, email, role, newsletter } =
                updatedUserData;
            const data = {
                first_name,
                last_name,
                email,
                role,
                newsletter,
            };
            return res.status(200).json({ success: true, user: data });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({
            success: false,
        });
    }
});

// @route       : GET /api/instructor/balance
// @description : Retrieve balance from account id of instructor from stripe
router.get("/balance", getUser, isInstructor, async (req, res) => {
    try {
        const balance = await stripe.balance.retrieve({
            stripeAccount: req.user.stripe_account_id,
        });
        return res.status(200).json({ success: true, balance: balance });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({
            success: false,
        });
    }
});

module.exports = router;
