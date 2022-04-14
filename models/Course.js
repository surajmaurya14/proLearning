const mongoose = require("mongoose");
const LessonsSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            minlength: 1,
            maxlength: 320,
        },

        description: {
            type: String,
            trim: true,
            required: true,
            min_length: 1,
            max_length: 512,
        },

        content_type: {
            type: String,
            enum: ["Video", "Question", "Notes", "Quiz"],
            required: true,
        },

        content: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Content",
            required: true,
        },

        for_preview: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);
const SectionSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            minlength: 1,
            maxlength: 320,
        },

        description: {
            type: String,
            trim: true,
            required: true,
            min_length: 1,
            max_length: 512,
        },

        lessons: [LessonsSchema],
    },
    { timestamps: true }
);
const CourseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            min_length: 1,
            max_length: 256,
            unique: true,
        },

        subtitle: {
            type: String,
            trim: true,
            required: true,
            min_length: 1,
            max_length: 512,
        },

        description: {
            type: String,
            trim: true,
            required: true,
            min_length: 1,
            max_length: 512,
        },

        objectives: [{ type: String }],

        requirements: [{ type: String }],

        category: {
            type: String,
            required: true,
        },

        language: {
            type: Object,
            required: true,
        },

        level: {
            type: String,
            required: true,
        },

        domain_restriction: { type: Boolean, required: true },

        domain: {
            type: String,
        },

        paid: {
            type: Boolean,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        currency_type: {
            type: Object,
        },

        thumbnail: {
            type: Object,
            required: true,
        },

        published: { type: Boolean, default: false },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        sections: [SectionSchema],

        lesson_count: {
            type: Number,
            default: 0,
        },

        slug: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
        },
    },

    { timestamps: true }
);
const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
