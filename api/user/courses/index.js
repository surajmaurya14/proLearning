const express = require("express");
const router = express.Router();
const { getUser } = require("../../../middlewares/verification");
const Course = require("../../../models/Course");
const User = require("../../../models/User");
const Order = require("../../../models/Order");
const Content = require("../../../models/Content");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @route       : POST /api/user/courses/enroll
// @description : User enrolls into a course if free or he is redirected to payment gateway for course purchase
router.post("/enroll", getUser, async (req, res) => {
    try {
        const course_id = req.body.course_id;
        const course = await Course.findById(course_id).populate(
            "instructor",
            "first_name last_name stripe_account_id"
        );

        if (course === null) {
            return res.status(400).json({
                success: false,
            });
        }

        if (course.paid === false) {
            const order = await Order.create({
                user: req.user._id,
                course: course._id,
                payment_status: true,
                payment_session: {},
            });
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                    $addToSet: {
                        enrolled_courses: course._id,
                    },
                    $push: {
                        orders: order,
                    },
                },
                {
                    new: true,
                }
            );
            return res.status(200).json({ success: true, user: updatedUser });
        } else {
            const applicationFee = (course.price * 50.0) / 100;
            const order = await Order.create({
                user: req.user._id,
                course: course._id,
                payment_status: false,
                payment_session: {},
            });
            const session = await stripe.checkout.sessions.create({
                success_url: `${process.env.STRIPE_PAYMENT_SUCCESS_URL}/${order._id}`,
                cancel_url: process.env.STRIPE_PAYMENT_CANCEL_URL,
                line_items: [
                    {
                        name: course.title,
                        amount: course.price.toFixed(2) * 100,
                        currency: "INR",
                        quantity: 1,
                    },
                ],
                mode: "payment",
                // payment_method_types: ["card"],
                payment_intent_data: {
                    application_fee_amount: applicationFee.toFixed(2) * 100,
                    transfer_data: {
                        destination: course.instructor.stripe_account_id,
                    },
                },
            });
            await User.findByIdAndUpdate(req.user._id, {
                stripe_session: session,
                $push: {
                    orders: order._id,
                },
            });
            return res
                .status(200)
                .json({ success: true, session_id: session.id });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/user/courses/fetch-content
// @description : User looks through the course page and finds a preview lesson. Preview content is retrieved
router.post("/fetch-content", getUser, async (req, res) => {
    try {
        const content = await Content.findById(req.body.content_id);
        if (content === null) {
            return res.status(400).json({ success: false });
        }
        if (content.free_preview === false) {
            if (req.user.enrolled_courses.includes(content.course)) {
                return res
                    .status(200)
                    .json({ success: true, content: content.data });
            } else {
                return res.status(401).json({ success: false });
            }
        } else {
            return res
                .status(200)
                .json({ success: true, content: content.data });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : GET /api/user/courses/stripe-success/:id
// @description : If the payment is successful, add course to user's enrolled_courses
router.get("/stripe-success/:id", getUser, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        const course = await Course.findById(order.course).populate(
            "instructor",
            "first_name last_name stripe_account_id"
        );
        if (course === null || req.user.stripe_session.id === null) {
            return res.status(400).json({
                success: false,
            });
        }
        const session = await stripe.checkout.sessions.retrieve(
            req.user.stripe_session.id
        );
        if (session.payment_status === "paid") {
            await Order.findByIdAndUpdate(order._id, {
                payment_status: true,
                payment_session: session,
            });
            const updatedUser = await User.findByIdAndUpdate(
                order.user,
                {
                    $addToSet: {
                        enrolled_courses: course._id,
                    },
                    $set: {
                        stripe_session: {},
                    },
                },
                {
                    new: true,
                }
            );
            return res.status(200).json({
                success: true,
                user: {
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    email: updatedUser.email,
                    newsletter: updatedUser.newsletter,
                    role: updatedUser.role,
                },
                course: course,
            });
        } else {
            await Order.findByIdAndUpdate(order._id, {
                payment_status: false,
                payment_session: session,
            });
            return res.status(400).json({
                success: false,
            });
        }
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : GET /api/user/courses/fetch-courses/:search
// @description : Retrieve the courses by search parameter
router.get("/fetch-courses/:search", async (req, res) => {
    try {
        const page = req.query.page;
        const toBeSkipped = (page - 1) * 10;
        const totalCourses = await Course.find({
            published: true,
            domain_restriction: false,
            title: { $regex: req.params.search, $options: "i" },
        }).countDocuments();
        const courses = await Course.find({
            published: true,
            domain_restriction: false,
            title: { $regex: req.params.search, $options: "i" },
        })
            .skip(toBeSkipped)
            .limit(10)
            .select("title thumbnail paid currency_type price slug")
            .populate("instructor", "_id first_name last_name");

        return res.status(200).json({
            success: true,
            courses: courses,
            totalCourses: totalCourses,
            totalPages: Math.ceil(totalCourses / 10),
        });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : GET /api/user/courses/fetch-courses
// @description : Retrieve the courses from the database for homepage
router.get("/fetch-courses", async (req, res) => {
    try {
        const page = req.query.page !== null ? 1 : req.query.page;
        const toBeSkipped = (page - 1) * 10;
        const totalCourses = await Course.find({
            published: true,
            domain_restriction: false,
        }).countDocuments();
        const courses = await Course.find({
            published: true,
            domain_restriction: false,
        })
            .skip(toBeSkipped)
            .limit(10)
            .select("title thumbnail paid currency_type price slug")
            .populate("instructor", "_id first_name last_name");

        return res.status(200).json({
            success: true,
            courses: courses,
            totalCourses: totalCourses,
            totalPages: Math.ceil(totalCourses / 10),
        });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : GET /api/user/courses/college-courses
// @description : Retrieve courses provided by the college from the database
router.get("/college-courses", getUser, async (req, res) => {
    try {
        const page = req.query.page !== null ? 1 : req.query.page;
        const toBeSkipped = (page - 1) * 10;
        const totalCourses = await Course.find({
            published: true,
            domain_restriction: true,
            domain: req.user.email.split("@")[1],
        }).countDocuments();
        const courses = await Course.find({
            published: true,
            domain_restriction: true,
            domain: req.user.email.split("@")[1],
        })
            .skip(toBeSkipped)
            .limit(10)
            .populate("instructor", "_id first_name last_name");
        return res.status(200).json({
            success: true,
            courses: courses,
            totalCourses: totalCourses,
            totalPages: Math.ceil(totalCourses / 10),
        });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : GET /api/user/courses/enrolled-courses
// @description : Retrieve all courses in which the user has enrolled
router.get("/enrolled-courses", getUser, async (req, res) => {
    try {
        const page = req.query.page !== null ? 1 : req.query.page;
        const toBeSkipped = (page - 1) * 10;
        const totalCourses = req.user.enrolled_courses.length;
        const user = await User.findById(req.user._id).populate({
            path: "enrolled_courses",
            options: {
                limit: 10,
                sort: { created: -1 },
                skip: toBeSkipped,
            },
            populate: {
                path: "instructor _id",
                select: "_id first_name last_name",
            },
        });
        return res.status(200).json({
            success: true,
            courses: user.enrolled_courses,
            totalCourses: totalCourses,
            totalPages: Math.ceil(totalCourses / 10),
        });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : GET /api/user/courses/:slug
// @description : Retrieve course by slug parameter for view
router.get("/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const course = await Course.findOne({
            slug,
        }).populate("instructor", "_id first_name last_name");

        return res.status(200).json({ success: true, course });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : GET /api/user/courses/check-enrollment/:slug
// @description : Check enrollment and retrieve course by slug parameter for loggedin user
router.get("/check-enrollment/:slug", getUser, async (req, res) => {
    try {
        const slug = req.params.slug;
        let found = false;
        const course = await Course.findOne({
            slug,
        }).populate("instructor", "_id first_name last_name");
        found = req.user.enrolled_courses.includes(course._id);
        if (found) {
            return res
                .status(200)
                .json({ success: true, enrolled: found, course: course });
        }
        return res.status(200).json({ success: true, enrolled: found });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

module.exports = router;
