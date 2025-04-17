"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importStar(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_model_1 = require("../user/user.model");
const mentor_constant_1 = require("./mentor.constant");
const mentor_model_1 = require("./mentor.model");
const mentorSchedule_model_1 = require("./mentorSchedule.model");
const userDetails_model_1 = require("../userDetails/userDetails.model");
const getAllMentors = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: mentor_constant_1.mentorSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    // Filters needs $and to fullfill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield mentor_model_1.Mentor.find(whereConditions)
        // .populate('academicSemester')
        // .populate('academicDepartment')
        .populate('scheduleId')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield mentor_model_1.Mentor.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleMentor = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mentor_model_1.Mentor.findOne({ userName: userName }).populate('scheduleId');
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Mentor not found !');
    }
    return result;
});
const updateMentor = (userName, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield mentor_model_1.Mentor.findOne({ userName });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Mentor not found !');
    }
    const { name } = payload, mentorData = __rest(payload, ["name"]);
    const updatedMentorData = Object.assign({}, mentorData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach((key) => {
            const nameKey = `name.${key}`; // `name.fisrtName`
            updatedMentorData[nameKey] = name[key];
        });
    }
    const result = yield mentor_model_1.Mentor.findOneAndUpdate({ userName }, updatedMentorData, {
        new: true,
    });
    return result;
});
const updateMentorSchedule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName } = payload;
    const isExist = yield mentor_model_1.Mentor.findOne({ userName });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Mentor not found !');
    }
    const { schedule } = payload;
    const result = yield mentorSchedule_model_1.MentorSchedule.findOneAndUpdate({ userName }, { userName: userName, schedule: schedule }, {
        new: true,
    });
    return result;
});
const rejectMentor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const mentor = yield mentor_model_1.Mentor.findByIdAndDelete(id);
    return mentor;
});
const deleteMentor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Delete mentor first
        const mentor = yield mentor_model_1.Mentor.findOneAndDelete({ _id: new mongoose_1.Types.ObjectId(id) }, { session });
        if (!mentor) {
            throw new ApiError_1.default(400, 'Failed to delete mentor');
        }
        // Delete related user
        yield user_model_1.User.deleteOne({ userName: mentor.userName }, { session });
        yield userDetails_model_1.UserDetails.deleteOne({ userName: mentor.userName }, { session });
        yield mentorSchedule_model_1.MentorSchedule.deleteOne({ userName: mentor.userName }, { session });
        yield session.commitTransaction();
        return mentor;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.MentorService = {
    getAllMentors,
    getSingleMentor,
    updateMentor,
    updateMentorSchedule,
    rejectMentor,
    deleteMentor,
};
