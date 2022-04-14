const mongoose = require("mongoose");
const ContentScheam = mongoose.Schema(
    {
        data: {
            type: Object,
            required: true,
        },

        for_preview: {
            type: Boolean,
            required: true,
            default: false,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
    },
    { timestamps: true }
);
const Content = mongoose.model("Content", ContentScheam);
module.exports = Content;
