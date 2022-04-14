const express = require("express");
const router = express.Router();

const { getUser } = require("../../middlewares/verification");

const {
    hashPassword,
    comparePassword,
} = require("../../utils-server/authentication");

// @route       : POST /api/user/settings/orders
// @description : Update account settings
router.post("/account", getUser, async (req, res) => {
    try {
        const { newsletter } = req.body;
        req.user.newsletter = newsletter;
        await req.user.save();
        return res.status(200).json({ success: true });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/user/settings/change-password
// @description : Update password settings
router.post("/change-password", getUser, async (req, res) => {
    try {
        const { current_password, password } = req.body;
        if (await comparePassword(current_password, req.user.password)) {
            const hash = await hashPassword(password);
            req.user.password = hash;
            await req.user.save();
            return res.status(200).json({ success: true });
        } else {
            return res
                .status(200)
                .json({ success: false, message: "Invalid current password" });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/user/settings/profile
// @description : Update profile settings
router.post("/profile", getUser, async (req, res) => {
    try {
        const { first_name, last_name } = req.body;
        req.user.first_name = first_name;
        req.user.last_name = last_name;
        await req.user.save();
        return res.status(200).json({ success: true });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

module.exports = router;
