const mongoose = require("mongoose");
const TrackSchema = mongoose.Schema(
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

        completed: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
        ],

        certificate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Certificate",
        },
    },
    { timestamps: true }
);
const Track = mongoose.model("Track", TrackSchema);
module.exports = Track;
