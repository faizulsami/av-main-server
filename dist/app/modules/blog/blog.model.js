"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    blogId: {
        type: String,
        required: true,
    },
    blogTitle: {
        type: String,
        required: true,
    },
    author: {
        type: String,
    },
    featuredImage: {
        type: String,
    },
    content: {
        type: String,
    },
    excerpt: {
        type: String,
    },
    blogSlug: {
        type: String,
    },
    blogCategory: {
        type: String,
    },
    blogInfo: {
        type: String,
    },
    blogType: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Blog = (0, mongoose_1.model)("Blog", BlogSchema);
