const express = require("express");
const router = express.Router();
const Compile = require("../../../utils-server/compiler");
const compileRequestQueue = require("../../../workers/compileRequestQueue");

// @route       : POST /api/user/practice/compile
// @description : Compile a program sent from the client
router.post("/compile", async (req, res) => {
    const { code, input, language } = req.body;
    if (Array.isArray(input)) {
        let output = [];
        for (item of input) {
            let job = await compileRequestQueue.add({
                code,
                input,
                language,
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
            return res.status(200).json({ success: true, output: data.stderr });
        else if (data.stdout)
            return res.status(200).json({ success: true, output: data.stdout });
        return res
            .status(200)
            .json({ success: false, message: "Enter a valid input" });
    }
});

module.exports = router;
