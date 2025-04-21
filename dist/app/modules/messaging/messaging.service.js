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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const messaging_constants_1 = require("./messaging.constants");
const messaging_model_1 = require("./messaging.model");
const createMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield messaging_model_1.Message.create(payload);
    return result;
});
const getSingleMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield messaging_model_1.Message.findById(id);
    return result;
});
const getAllMessages = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: messaging_constants_1.messagingFilterableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
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
    // Dynamic sort needs  fields to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // If there is no condition , put {} to give all data
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield messaging_model_1.Message.find(whereConditions)
        .populate("sentBy")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield messaging_model_1.Message.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// const updateFaculty = async (
//   id: string,
//   payload: Partial<IAcademicFaculty>
// ): Promise<IAcademicFaculty | null> => {
//   const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
//     new: true,
//   });
//   return result;
// };
// const deleteByIdFromDB = async (
//   id: string
// ): Promise<IAcademicFaculty | null> => {
//   const result = await AcademicFaculty.findByIdAndDelete(id);
//   return result;
// };
const updateMessageSeenStatus = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await Message.findOneAndUpdate({ orderId: orderId },{sentBy:userId},  {
    //   new: true,
    // });
    // const result= await Message.updateMany({orderId:{$eq:orderId }},
    //   {isSeen:true});
    const result = yield messaging_model_1.Message.updateMany({
        $and: [
            // { orderId: { $eq: orderId } },
            { sentBy: { $ne: userName } },
        ],
    }, {
        $set: { isSeen: true },
    });
    return result;
});
exports.MessagingService = {
    createMessage,
    getSingleMessage,
    getAllMessages,
    updateMessageSeenStatus,
};
