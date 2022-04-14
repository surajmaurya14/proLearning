const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
            trim: true,
            required: true,
        },
        last_name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 64,
        },
        role: {
            type: [String],
            default: "Student",
            enum: ["Student", "Instructor", "Admin"],
        },
        newsletter: {
            type: Boolean,
            required: true,
            default: false,
        },
        account_verified: {
            type: Boolean,
            default: false,
        },
        password_reset_token: {
            type: String,
            default: "",
        },
        account_verification_token: {
            type: String,
            default: "",
        },
        verification_token_expiry_date: {
            type: Date,
            default: undefined,
        },
        reset_token_expiry_date: {
            type: Date,
            default: undefined,
        },

        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
                required: true,
            },
        ],

        enrolled_courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                required: true,
            },
        ],

        stripe_account_id: {
            type: String,
        },
        stripe_instructor: { type: Object },
        stripe_session: { type: Object },
    },
    { timestamps: true }
);
const User = mongoose.model("User", UserSchema);
module.exports = User;
