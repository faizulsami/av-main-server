"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetails = void 0;
const mongoose_1 = require("mongoose");
const UserDetailsSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    age: {
        type: Number,
    },
}, {
    timestamps: true,
});
exports.UserDetails = (0, mongoose_1.model)("UserDetails", UserDetailsSchema);
