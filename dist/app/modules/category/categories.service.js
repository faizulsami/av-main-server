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
exports.CategoriesService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const categories_model_1 = require("./categories.model");
;
const createCategories = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // const id = await generateOrderId();
        const id = "123456789";
        payload.id = id;
        const result = yield categories_model_1.Categories.create(payload);
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getSingleCategories = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield categories_model_1.Categories.findById(id);
});
// const getSingleBlogBySlug = async (
//   slug: string
// ): Promise<IBlog | null> => {
//   const result = await Blog.findOne({blogSlug:slug});
//   return result;
// };
const getAllCategories = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search needs $or for searching in specified fields
    // if (searchTerm) {
    //   andConditions.push({
    //     $or: academicFacultySearchableFields.map(field => ({
    //       [field]: {
    //         $regex: searchTerm,
    //         $options: 'i',
    //       },
    //     })),
    //   });
    // }
    // Filters needs $and to fullfill all the conditions
    // console.log("filtersData",filtersData)
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // Dynamic sort needs  fields to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // If there is no condition , put {} to give all data
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    console.log(whereConditions);
    const result = yield categories_model_1.Categories.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield categories_model_1.Categories.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateCategories = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_model_1.Categories.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const deleteCategoriesFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_model_1.Categories.findByIdAndDelete(id);
    return result;
});
exports.CategoriesService = {
    createCategories,
    getSingleCategories,
    getAllCategories,
    updateCategories,
    deleteCategoriesFromDB,
};
