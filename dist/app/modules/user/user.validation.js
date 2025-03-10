"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const mentor_constant_1 = require("../mentor/mentor.constant");
const createMenteeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().optional(),
        userName: zod_1.z.string({
            required_error: "user name is required",
        }),
        mentee: zod_1.z.object({
            gender: zod_1.z.enum([...mentor_constant_1.gender], {
                required_error: "Gender is required",
            }),
        }),
    }),
});
exports.UserValidation = {
    createMenteeZodSchema,
};
