const express = require("express");
const router = express.Router();
const {
    getUser,
    isEnrolled,
    isEnrolledID,
} = require("../../../middlewares/verification");
const compileRequestQueue = require("../../../workers/compileRequestQueue");

router.use("/track", require("./track"));

// @route       : POST /api/user/course/data
// @description : Check enrollment and retrieive course by slug parameter for user
router.post("/data", getUser, isEnrolled, async (req, res) => {
    try {
        return res.status(200).json({ success: true, course: req.course });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/user/course/compile
// @description : Check enrollment and compile the program for user
router.post("/compile", getUser, isEnrolledID, async (req, res) => {
    const { code, input, language } = req.body;
    try {
        if (Array.isArray(input)) {
            let output = [];
            for (item of input) {
                let job = await compileRequestQueue.add({
                    code: code,
                    input: item.input,
                    language: language,
                });
                const data = await job.finished();
                if (data.stderr) output.push(data.stderr);
                else if (data.stdout) output.push(data.stdout);
                else output.push("Enter a valid input");
            }
            return res.status(200).json({ success: true, output: output });
        } else {
            let job = await compileRequestQueue.add({
                code,
                input,
                language,
            });
            const data = await job.finished();
            if (data.stderr)
                return res
                    .status(200)
                    .json({ success: true, output: data.stderr });
            else if (data.stdout)
                return res
                    .status(200)
                    .json({ success: true, output: data.stdout });
            return res
                .status(200)
                .json({ success: false, message: "Enter a valid input" });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

module.exports = router;
