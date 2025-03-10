"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = void 0;
const mongoose_1 = require("mongoose");
const CategoriesSchema = new mongoose_1.Schema({
    interestedUsers: {
        type: String,
        required: true,
        default: 0,
    },
    respondedUsers: {
        type: String,
        required: true,
        default: 0,
    },
    serviceNeedsTo: {
        type: String,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Categories = (0, mongoose_1.model)("Categories", CategoriesSchema);
