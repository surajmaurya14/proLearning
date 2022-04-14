const jwt = require("jsonwebtoken");
const User = require("../models/User");
const formidable = require("formidable");
const Course = require("../models/Course");

const getUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (token === undefined) {
        return res.status(500).json({ success: false });
    }
    const userData = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
    });

    if (userData === undefined || userData._id === undefined) {
        return res.status(401).json({ success: false });
    }
    try {
        const user = await User.findById(userData._id);
        if (user !== undefined) {
            req.user = user;
            next();
        } else {
            return res.status(401).json({ success: false });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.user.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false });
        } else {
            next();
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
};

const isEnrolled = async (req, res, next) => {
    try {
        const course = await Course.findOne({ slug: req.body.slug }).populate(
            "instructor",
            "first_name last_name"
        );
        if (
            course !== undefined &&
            req.user.enrolled_courses.includes(course._id)
        ) {
            req.course = course;
            next();
        } else {
            return res.status(401).json({ success: false });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
};

const isEnrolledID = async (req, res, next) => {
    try {
        const course = await Course.findById(req.body.course_id);
        if (
            course !== undefined &&
            req.user.enrolled_courses.includes(course._id)
        ) {
            req.course = course;
            next();
        } else {
            return res.status(401).json({ success: false });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
};

const isInstructor = async (req, res, next) => {
    try {
        if (req.user && req.user.role.includes("Instructor")) {
            next();
        } else {
            return res.status(401).json({ success: "false" });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
};

const isCourseInstructor = async (req, res, next) => {
    try {
        const course = await Course.findOne({
            _id: req.body.course_id,
            instructor: req.user._id,
        });
        if (course) {
            req.course = course;
            next();
        } else {
            return res.status(401).json({ success: "false" });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
};

const isCourseInstructorSlug = async (req, res, next) => {
    try {
        const course = await Course.findOne({
            slug: req.body.slug,
            instructor: req.user._id,
        });
        if (course) {
            req.course = course;
            next();
        } else {
            return res.status(401).json({ success: "false" });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
};

const getMultipartFormData = async (req, res, next) => {
    const form = formidable({ maxFileSize: 200 * 1024 * 1024 });
    form.parse(req, (err, fields, files) => {
        if (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
        req.fields = fields;
        req.files = files;
        next();
    });
};

const isCourseInstructorMFD = async (req, res, next) => {
    try {
        const course = await Course.findOne({
            _id: req.fields.course_id,
            instructor: req.user._id,
        });
        if (course) {
            req.course = course;
            next();
        } else {
            return res.status(401).json({ success: "false" });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
};

module.exports = {
    getUser,
    isAdmin,
    isInstructor,
    isCourseInstructor,
    getMultipartFormData,
    isCourseInstructorSlug,
    isCourseInstructorMFD,
    isEnrolled,
    isEnrolledID,
};
