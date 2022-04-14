const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Certificate = require("../../models/Certificate");

// @route       : GET /api/certificate
// @description : Retrieve course completion certificate by certificate id
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(200).json({ success: false });
        }
        const certificate = await Certificate.findById(req.params.id)
            .populate("user", "first_name last_name")
            .populate({
                path: "course",
                select: "_id title instructor",
                populate: {
                    path: "instructor",
                    model: "User",
                    select: "first_name last_name",
                },
            });

        if (certificate !== null) {
            return res
                .status(200)
                .json({ success: true, certificate: certificate });
        } else {
            return res.status(200).json({ success: false });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

module.exports = router;
