"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorValidation = void 0;
const zod_1 = require("zod");
const mentor_constant_1 = require("./mentor.constant");
const updateMentorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.object({
            firstName: zod_1.z.string().optional(),
            lastName: zod_1.z.string().optional(),
            middleName: zod_1.z.string().optional(),
        }),
        gender: zod_1.z.enum([...mentor_constant_1.gender]).optional(),
        dateOfBirth: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        contactNo: zod_1.z.string().optional(),
        emergencyContactNo: zod_1.z.string().optional(),
        bloodGroup: zod_1.z.enum([...mentor_constant_1.bloodGroup]).optional(),
        presentAddress: zod_1.z.string().optional(),
        permanentAddress: zod_1.z.string().optional(),
        // academicSemester: z.string().optional(),
        // academicDepartment: z.string().optional(),
        // academicFaculty: z.string().optional(),
        // guardian: z
        //   .object({
        //     fatherName: z.string().optional(),
        //     fatherOccupation: z.string().optional(),
        //     fatherContactNo: z.string().optional(),
        //     motherName: z.string().optional(),
        //     motherOccupation: z.string().optional(),
        //     motherContactNo: z.string().optional(),
        //     address: z.string().optional(),
        //   })
        //   .optional(),
        // localGuardian: z
        //   .object({
        //     name: z.string().optional(),
        //     occupation: z.string().optional(),
        //     contactNo: z.string().optional(),
        //     address: z.string().optional(),
        //   })
        //   .optional(),
        // profileImage: z.string().optional(),
    }),
});
exports.MentorValidation = {
    updateMentorZodSchema,
};
