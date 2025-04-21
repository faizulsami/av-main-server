"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorSchedule = void 0;
const mongoose_1 = require("mongoose");
const MentorScheduleSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    schedule: {
        type: [
            {
                day: { type: String, required: true },
                startTime: {
                    type: {
                        hours: { type: Number, required: true },
                        minutes: { type: Number, required: true },
                    },
                },
                endTime: {
                    type: {
                        hours: { type: Number, required: true },
                        minutes: { type: Number, required: true },
                    },
                },
                isAvailable: {
                    type: Boolean,
                    required: true,
                    default: false,
                },
            },
        ],
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.MentorSchedule = (0, mongoose_1.model)("MentorSchedule", MentorScheduleSchema);
