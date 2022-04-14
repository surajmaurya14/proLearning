const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        payment_status: {
            type: Boolean,
            required: true,
        },
        payment_session: {
            type: Object,
            required: true,
        },
    },

    { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
