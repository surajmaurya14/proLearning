const express = require("express");
const router = express.Router();

router.use("/csrf-token", require("./csrf-token"));
router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/instructor", require("./instructor"));
router.use("/certificate", require("./certificate"));

router.all("/", async (req, res) => {
    return res.status(401).json({ success: false });
});

module.exports = router;
