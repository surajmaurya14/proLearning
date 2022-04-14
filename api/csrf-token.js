const express = require("express");
const router = express.Router();

// @route       : Get /api/csrf-token
// @description : Get a csrf token from server
router.get("/", (req, res) => {
    // console.log("REMOTE ADDRESS:", req.ip);
    return res.status(200).json({ success: true, csrfToken: req.csrfToken() });
});

module.exports = router;
