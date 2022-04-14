const express = require("express");
const { readFileSync } = require("fs");
const { nanoid } = require("nanoid");
const slugify = require("slugify");

const router = express.Router();
const {
    getUser,
    isInstructor,
    getMultipartFormData,
    isCourseInstructor,
    isCourseInstructorSlug,
    isCourseInstructorMFD,
} = require("../../../middlewares/verification");

const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const Course = require("../../../models/Course");
const User = require("../../../models/User");
const Content = require("../../../models/Content");

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    apiVersion: process.env.AWS_API_VERSION,
    region: process.env.AWS_REGION,
});

// @route       : POST /api/instructor/course/upload-image
// @description : Verify instructor and upload the image to AWS-S3
router.post("/upload-image", getUser, isInstructor, async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ success: false });
        }
        const base64Data = new Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );

        const typeOfImage = image.split(";")[0].split("/")[1];
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `${nanoid()}${Date.now()}.${typeOfImage}`,
            Body: base64Data,
            ACL: "public-read",
            ContentEncoding: "base64",
            ContentType: `image/${typeOfImage}`,
        };
        const uploadImage = new PutObjectCommand(params);
        await client.send(uploadImage);

        return res.status(200).json({
            success: true,
            about: {
                Key: params.Key,
                location: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
            },
        });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/instructor/course/delete-image
// @description : Verify instructor and remove the image from AWS-S3
router.post("/delete-image", getUser, isInstructor, async (req, res) => {
    try {
        const { image_data } = req.body;
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: image_data.Key,
        };
        const removeImage = new DeleteObjectCommand(params);
        await client.send(removeImage);
        return res.status(200).json({ success: true });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : PUT /api/instructor/course
// @description : Verify instructor, course instructor and update the course
router.put("/", getUser, isInstructor, isCourseInstructor, async (req, res) => {
    try {
        if (req.body.title !== req.course.title) {
            const slugExist = await Course.findOne({
                slug: slugify(req.body.title.toLowerCase()),
            });
            if (slugExist) {
                return res.status(200).json({
                    success: false,
                    message: "Title already taken. Please use another title",
                });
            }
        }

        const {
            title,
            subtitle,
            description,
            objectives,
            requirements,
            category,
            language,
            level,
            domain_restriction,
            domain,
            paid,
            price,
            currency_type,
            thumbnail,
            sections,
        } = req.body;
        if (
            (title === undefined || subtitle === undefined,
            description == undefined ||
                objectives == undefined ||
                requirements == undefined ||
                category == undefined ||
                language == undefined ||
                level == undefined ||
                domain_restriction == undefined ||
                domain == undefined ||
                paid == undefined ||
                price == undefined ||
                currency_type == undefined ||
                thumbnail == undefined)
        ) {
            return res.status(400).json({ success: false });
        }
        if (price < 199 || price > 9999) {
            return res.status(400).json({ success: false });
        }
        let length = 0;
        for (let section of sections) {
            length = length + section.lessons.length;
        }

        const course = await Course.findByIdAndUpdate(req.course._id, {
            title,
            subtitle,
            description,
            objectives,
            requirements,
            category,
            language,
            level,
            domain_restriction,
            domain,
            paid,
            price,
            thumbnail,
            currency_type,
            sections,
            slug: slugify(title.toLowerCase()),
            lesson_count: length,
        });
        return res.status(200).json({ success: true, course });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : PUT /api/instructor/course/update-status
// @description : Verify instructor, course instructor and update the lesson count
router.put(
    "/update-status",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            let length = 0;
            for (let section of req.course.sections) {
                length = length + section.lessons.length;
            }

            const updatedCourse = await Course.findByIdAndUpdate(
                req.course._id,
                {
                    lesson_count: length,
                },
                { new: true }
            );

            return res.status(200).json({ success: true });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : PUT /api/instructor/course/status
// @description : Verify instructor, course instructor and update the lesson count
router.put(
    "/status",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            let length = 0;
            for (let section of req.course.sections) {
                length = length + section.lessons.length;
            }
            const { published } = req.body;

            const updatedCourse = await Course.findByIdAndUpdate(
                req.course._id,
                {
                    published,
                    lesson_count: length,
                },
                { new: true }
            ).populate("instructor", "first_name last_name _id");

            return res
                .status(200)
                .json({ success: true, course: updatedCourse });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : POST /api/instructor/course/fetch-content
// @description : Verify instructor, course instructor and retrieve content of the course
router.post(
    "/fetch-content",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            const content = await Content.findById(req.body.content_id);
            if (content === null) {
                return res.status(400).json({ success: false });
            }
            return res
                .status(200)
                .json({ success: true, content: content.data });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : POST /api/instructor/course/students-count
// @description : Verify instructor, course instructor and retrieve count of students enrolled in the course
router.post(
    "/students-count",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            const countOfUsers = await User.find({
                enrolled_courses: req.course._id,
            }).countDocuments();
            return res.status(200).json({ success: true, count: countOfUsers });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : POST /api/instructor/course/sections
// @description : Verify instructor, course instructor and add section
router.post(
    "/sections",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            const course = await Course.findByIdAndUpdate(
                req.course._id,
                {
                    $push: {
                        sections: {
                            title: req.body.title,
                            description: req.body.description,
                            lessons: [],
                        },
                    },
                },
                { new: true }
            ).populate("instructor", "first_name last_name _id");
            return res.status(200).json({
                success: true,
                course,
            });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : PUT /api/instructor/course/sections
// @description : Verify instructor, course instructor and edit section
router.put(
    "/sections",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            const course = await Course.findByIdAndUpdate(
                req.course._id,
                {
                    $set: {
                        "sections.$[section].title": req.body.title,
                        "sections.$[section].description": req.body.description,
                        "sections.$[section].slug": slugify(req.body.title),
                    },
                },
                {
                    arrayFilters: [{ "section._id": req.body.section_id }],
                }
            );
            return res.status(200).json({
                success: true,
            });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : PUT /api/instructor/course/sections/lessons/remove
// @description : Verify instructor, course instructor and remove a lesson from a section
router.put(
    "/sections/lessons/remove",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            const content = await Content.findById(req.body.content_id);
            const course = await Course.findOneAndUpdate(
                {
                    _id: req.course._id,
                    instructor: req.user._id,
                    "sections._id": req.body.section_id,
                },
                {
                    $pull: {
                        "sections.$.lessons": { _id: req.body.lesson_id },
                    },
                },
                {
                    new: true,
                }
            );
            let length = 0;
            for (let section of course.sections) {
                length = length + section.lessons.length;
            }
            await Course.findByIdAndUpdate(course._id, {
                lesson_count: length,
            });
            if (content !== null && content.data.Key !== undefined) {
                const params = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: content.data.Key,
                };
                const removeVideo = new DeleteObjectCommand(params);
                await client.send(removeVideo);
            }
            await Content.findByIdAndDelete(content._id);

            return res.status(200).json({ success: true });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : PUT /api/instructor/course/sections/remove
// @description : Verify instructor, course instructor and remove a lesson from a section
router.put(
    "/sections/remove",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            const removalData = req.course.sections[req.body.section_index];
            const length = req.course.lesson_count - removalData.lessons.length;
            removalData.lessons.map(async (lesson) => {
                const content = await Content.findById(lesson.content);
                if (content !== null && content.data.Key !== undefined) {
                    const params = {
                        Bucket: process.env.AWS_BUCKET,
                        Key: content.data.Key,
                    };
                    const removeVideo = new DeleteObjectCommand(params);
                    await client.send(removeVideo);
                }
                await Content.findByIdAndDelete(content._id);
            });
            await Course.findByIdAndUpdate(req.course._id, {
                $pull: {
                    sections: { _id: req.body.section_id },
                },
                lesson_count: length,
            });
            return res.status(200).json({ success: true });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : POST /api/instructor/course
// @description : Verify instructor and create a new course
router.post("/", getUser, isInstructor, async (req, res) => {
    try {
        const slugExist = await Course.findOne({
            slug: slugify(req.body.title.toLowerCase()),
        });
        if (slugExist) {
            return res.status(200).json({
                success: false,
                message: "Title already taken. Please use another title",
            });
        }
        const {
            title,
            subtitle,
            description,
            objectives,
            requirements,
            category,
            language,
            level,
            domain_restriction,
            domain,
            paid,
            price,
            currency_type,
            thumbnail,
        } = req.body;
        if (
            (title === undefined || subtitle === undefined,
            description == undefined ||
                objectives == undefined ||
                requirements == undefined ||
                category == undefined ||
                language == undefined ||
                level == undefined ||
                domain_restriction == undefined ||
                domain == undefined ||
                paid == undefined ||
                price == undefined ||
                currency_type == undefined ||
                thumbnail == undefined)
        ) {
            return res.status(400).json({ success: false });
        }
        if (price < 199 || price > 9999) {
            return res.status(400).json({ success: false });
        }

        await Course.create({
            slug: slugify(title.toLowerCase()),
            instructor: req.user._id,
            title,
            subtitle,
            description,
            objectives,
            requirements,
            category,
            language,
            level,
            domain_restriction,
            domain,
            paid,
            price,
            currency_type,
            thumbnail,
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/instructor/course/fetch-courses
// @description : Verify instructor and retrieve all courses of instructor
router.get("/fetch-courses", getUser, isInstructor, async (req, res) => {
    try {
        const course = await Course.find({
            instructor: req.user._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, courses: course });
    } catch (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).json({ success: false });
    }
});

// @route       : POST /api/instructor/course/data
// @description : Verify instructor, course instructor and retrieve data of the course
router.post(
    "/data",
    getUser,
    isInstructor,
    isCourseInstructorSlug,
    async (req, res) => {
        try {
            const course = await Course.findById(req.course._id).populate(
                "instructor",
                "first_name last_name _id"
            );
            return res.status(200).json({ success: true, course });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : POST /api/instructor/course/upload-video
// @description : Verify instructor and upload video to AWS-S3
router.post(
    "/upload-video",
    getUser,
    isInstructor,
    getMultipartFormData,
    isCourseInstructorMFD,
    async (req, res) => {
        try {
            const { video } = req.files;
            if (!video) {
                return res.status(400).json({ success: false });
            }
            const typeOfVideo = video.mimetype.split("/")[1];
            const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: `${nanoid()}${Date.now()}.${typeOfVideo}`,
                Body: readFileSync(video.filepath),
                ACL: "public-read",
                ContentType: `video/${typeOfVideo}`,
            };
            const uploadVideo = new PutObjectCommand(params);
            await client.send(uploadVideo);

            return res.status(200).json({
                success: true,
                about: {
                    Key: params.Key,
                    location: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
                },
            });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : POST /api/instructor/course/upload-notes
// @description : Verify instructor and upload notes to AWS-S3
router.post(
    "/upload-notes",
    getUser,
    isInstructor,
    getMultipartFormData,
    isCourseInstructorMFD,
    async (req, res) => {
        try {
            const { notes } = req.files;
            if (!notes) {
                return res.status(400).json({ success: false });
            }
            const typeOfNotes = notes.mimetype.split("/")[1];
            const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: `${nanoid()}${Date.now()}.${typeOfNotes}`,
                Body: readFileSync(notes.filepath),
                ACL: "public-read",
                ContentType: `application/${typeOfNotes}`,
            };
            const uploadNotes = new PutObjectCommand(params);
            await client.send(uploadNotes);

            return res.status(200).json({
                success: true,
                about: {
                    Key: params.Key,
                    location: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
                },
            });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : POST /api/instructor/course/sections/lessons
// @description : Verify instructor, course instructor and add lesson to a section
router.post(
    "/sections/lessons",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            const content = await Content.create({
                for_preview:
                    req.body.content_type === "Video"
                        ? req.body.for_preview
                        : false,
                data: req.body.content,
                course: req.course._id,
            });
            const course = await Course.findOneAndUpdate(
                {
                    _id: req.course._id,
                    "sections._id": req.body.section_id,
                },
                {
                    $push: {
                        "sections.$.lessons": {
                            title: req.body.title,
                            description: req.body.description,
                            content_type: req.body.content_type,
                            for_preview:
                                req.body.content_type === "Video"
                                    ? req.body.for_preview
                                    : false,
                            content: content._id,
                        },
                    },
                    $inc: {
                        lesson_count: 1,
                    },
                },
                {
                    new: true,
                }
            ).populate("instructor", "first_name last_name _id");
            return res.status(200).json({
                success: true,
                course,
            });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : PUT /api/instructor/course/sections/lessons
// @description : Verify instructor, course instructor and edit lesson to a section
router.put(
    "/sections/lessons",
    getUser,
    isInstructor,
    isCourseInstructor,
    async (req, res) => {
        try {
            const content = await Content.findByIdAndUpdate(
                req.body.content_id,
                {
                    for_preview: req.body.for_preview,
                    data: req.body.content,
                }
            );
            await Course.updateOne(
                {
                    _id: req.course._id,
                },
                {
                    $set: {
                        "sections.$[section].lessons.$[lesson].title":
                            req.body.title,
                        "sections.$[section].lessons.$[lesson].description":
                            req.body.description,
                        "sections.$[section].lessons.$[lesson].content_type":
                            req.body.content_type,
                        "sections.$[section].lessons.$[lesson].for_preview":
                            req.body.for_preview,
                        "sections.$[section].lessons.$[lesson].content":
                            content._id,
                    },
                },
                {
                    arrayFilters: [
                        { "section._id": req.body.section_id },
                        { "lesson._id": req.body.lesson_id },
                    ],
                }
            );
            return res.status(200).json({
                success: true,
            });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

// @route       : POST /api/instructor/course/delete-file
// @description : Verify instructor, course instructor and remove a file from AWS-S3
router.post(
    "/delete-file",
    getUser,
    isInstructor,
    isCourseInstructor,

    async (req, res) => {
        try {
            const { Key } = req.body;
            const params = {
                Bucket: process.env.AWS_BUCKET,
                Key,
            };
            const removeVideo = new DeleteObjectCommand(params);
            await client.send(removeVideo);
            return res.status(200).json({ success: true });
        } catch (err) {
            // console.error(`Error: ${err}`);
            return res.status(500).json({ success: false });
        }
    }
);

module.exports = router;
