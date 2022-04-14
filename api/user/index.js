const express = require("express");
const router = express.Router();
const { getUser } = require("../../middlewares/verification");
const Order = require("../../models/Order");

router.use("/settings", require("./settings"));
router.use("/courses", require("./courses"));
router.use("/course", require("./course"));
router.use("/practice", require("./practice"));

// @route       : GET /api/user/orders
// @description : Retrieve all orders made by user
router.get("/orders", getUser, async (req, res) => {
    try {
        const page = req.query.page !== null ? 1 : req.query.page;
        const toBeSkipped = (page - 1) * 10;
        const totalOrders = await Order.find({
            user: req.user._id,
        }).countDocuments();
        const orders = await Order.find({ user: req.user._id })
            .skip(toBeSkipped)
            .limit(10)
            .populate(
                "course",
                "paid title subtitle thumbnail price currency_type slug"
            );

        return res.status(200).json({
            success: true,
            orders: orders,
            totalOrders: totalOrders,
            totalPages: Math.ceil(totalOrders / 10),
        });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

module.exports = router;
