"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = require("mongoose");
const AppointmentSlotSchema = new mongoose_1.Schema({
    time: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
});
const AppointmentSchema = new mongoose_1.Schema({
    appointmentType: {
        type: String,
    },
    appointmentDate: {
        type: Date,
    },
    status: {
        type: String,
    },
    durationMinutes: {
        type: Number,
    },
    selectedSlot: {
        type: [AppointmentSlotSchema],
    },
    mentorUserName: {
        type: String,
    },
    menteeUserName: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Appointment = (0, mongoose_1.model)("Appointment", AppointmentSchema);
