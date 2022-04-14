const express = require("express");
const router = express.Router();
const {
    getUser,
    isEnrolledID,
} = require("../../../../middlewares/verification");
const Track = require("../../../../models/Track");
const Certificate = require("../../../../models/Certificate");

// @route       : POST /api/user/course/track/completed-lessons
// @description : Check enrollment and retrieve completed lessons
router.post("/completed-lessons", getUser, isEnrolledID, async (req, res) => {
    try {
        const track = await Track.findOne({
            user: req.user._id,
            course: req.course._id,
        });

        if (track !== null) {
            return res.status(200).json({
                success: true,
                completed_lessons: track.completed,
                certificate: track.certificate,
            });
        } else {
            return res.status(200).json({
                success: true,
                completed_lessons: [],
                certificate: null,
            });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/user/course/track/mark-lesson
// @description : Check enrollment and mark the lesson, completed or pending
router.post("/mark-lesson", getUser, isEnrolledID, async (req, res) => {
    try {
        const track = await Track.findOne({
            user: req.user._id,
            course: req.course._id,
        });

        if (track !== null) {
            if (track.completed.includes(req.body.lesson_id)) {
                await Track.findByIdAndUpdate(track._id, {
                    $pull: { completed: req.body.lesson_id },
                });
                return res.status(200).json({ success: true, status: false });
            } else {
                await Track.findByIdAndUpdate(track._id, {
                    $addToSet: { completed: req.body.lesson_id },
                });
                return res.status(200).json({ success: true, status: true });
            }
        } else {
            await Track.create({
                user: req.user._id,
                course: req.course._id,
                completed: [req.body.lesson_id],
                certificate: null,
            });
            return res.status(200).json({ success: true, status: true });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/user/course/track/certificate
// @description : Check enrollment and generate certificate for user on course completion
router.post("/certificate", getUser, isEnrolledID, async (req, res) => {
    try {
        const track = await Track.findOne({
            user: req.user._id,
            course: req.course._id,
        });

        if (track == null) {
            return res.status(200).json({ success: false });
        } else if (track.certificate !== null) {
            return res.status(200).json({ success: false });
        } else {
            let completedPercentage =
                (track.completed.length / req.course.lesson_count) * 100.0;

            if (completedPercentage > 90) {
                const certificate = await Certificate.create({
                    user: req.user._id,
                    course: track.course,
                });
                const updatedTrack = await Track.findByIdAndUpdate(
                    track._id,
                    {
                        certificate: certificate._id,
                    },
                    { new: true }
                );
                return res.status(200).json({
                    success: true,
                    certificate: updatedTrack.certificate,
                });
            } else {
                return res.status(200).json({ success: false });
            }
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

module.exports = router;
