"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    receiver: {
        type: String,
        required: true,
    },
    listenerUsername: {
        type: String,
        default: null,
    },
    type: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    isSeen: {
        type: Boolean,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Notification = (0, mongoose_1.model)("Notification", NotificationSchema);
