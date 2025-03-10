"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mentor = void 0;
const mongoose_1 = require("mongoose");
const MentorSchema = new mongoose_1.Schema({
    userName: {
        type: String,
    },
    name: {
        type: String,
    },
    bio: {
        type: String,
    },
    phone: {
        type: String,
    },
    gender: {
        type: String,
    },
    designation: {
        type: String,
    },
    specialization: {
        type: String,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    adminApproval: {
        type: Boolean,
    },
    email: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    scheduleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "MentorSchedule",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Mentor = (0, mongoose_1.model)("Mentor", MentorSchema);
