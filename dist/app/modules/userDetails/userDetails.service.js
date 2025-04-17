"use strict";
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
exports.UserDetailsService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const userDetails_model_1 = require("./userDetails.model");
const getSingleUserDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userDetails_model_1.UserDetails.findOne({ _id: id });
    return result;
});
// const getAllAdmins = async (
//   filters: IUserDetailsFilters,
//   paginationOptions: IPaginationOptions
// ): Promise<IGenericResponse<IUserDetails[]>> => {
//   // Extract searchTerm to implement search query
//   const { searchTerm, ...filtersData } = filters;
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(paginationOptions);
//   const andConditions = [];
//   // Search needs $or for searching in specified fields
//   if (searchTerm) {
//     andConditions.push({
//       $or: adminSearchableFields.map(field => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: 'i',
//         },
//       })),
//     });
//   }
//   // Filters needs $and to fullfill all the conditions
//   if (Object.keys(filtersData).length) {
//     andConditions.push({
//       $and: Object.entries(filtersData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }
//   // Dynamic sort needs  fields to  do sorting
//   const sortConditions: { [key: string]: SortOrder } = {};
//   if (sortBy && sortOrder) {
//     sortConditions[sortBy] = sortOrder;
//   }
//   // If there is no condition , put {} to give all data
//   const whereConditions =
//     andConditions.length > 0 ? { $and: andConditions } : {};
//   const result = await Admin.find(whereConditions)
//     .populate('managementDepartment')
//     .sort(sortConditions)
//     .skip(skip)
//     .limit(limit);
//   const total = await Admin.countDocuments(whereConditions);
//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };
const updateUserDetails = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield userDetails_model_1.UserDetails.findOne({ _id: id });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found !');
    }
    const { name } = payload, adminData = __rest(payload, ["name"]);
    const updatedStudentData = Object.assign({}, adminData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach((key) => {
            const nameKey = `name.${key}`;
            updatedStudentData[nameKey] = name[key];
        });
    }
    console.log('updatedStudentData', updatedStudentData);
    // const result:any= []
    const result = yield userDetails_model_1.UserDetails.findOneAndUpdate({ _id: id }, updatedStudentData, {
        new: true,
    });
    return result;
});
// const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
//   // check if the faculty is exist
//   const isExist = await Admin.findOne({ id });
//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !');
//   }
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     //delete student first
//     const student = await Admin.findOneAndDelete({ id }, { session });
//     if (!student) {
//       throw new ApiError(404, 'Failed to delete student');
//     }
//     //delete user
//     await User.deleteOne({ id });
//     session.commitTransaction();
//     session.endSession();
//     return student;
//   } catch (error) {
//     session.abortTransaction();
//     throw error;
//   }
// };
exports.UserDetailsService = {
    getSingleUserDetails,
    updateUserDetails,
};
