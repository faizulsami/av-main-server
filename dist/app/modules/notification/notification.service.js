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
exports.NotificationService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const messaging_constants_1 = require("./messaging.constants");
const notification_model_1 = require("./notification.model");
const createNotification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.create(payload);
    return result;
});
const getSingleMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.findById(id);
    return result;
});
const getAllNotification = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield notification_model_1.Notification.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    let unseenNotifications;
    const total = yield notification_model_1.Notification.countDocuments(whereConditions);
    if (filtersData === null || filtersData === void 0 ? void 0 : filtersData.receiver) {
        unseenNotifications = yield notification_model_1.Notification.countDocuments({
            isSeen: false,
            receiver: filtersData.receiver,
        });
    }
    else {
        unseenNotifications = yield notification_model_1.Notification.countDocuments({
            adminAcknowledgement: false,
        });
    }
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: { result: result, unseenNotifications },
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
const updateNotificationSeenStatus = (receiver) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (receiver) {
        result = yield notification_model_1.Notification.updateMany({
            $and: [
                { receiver: { $eq: receiver } },
                // { sentBy: { $ne: userId } }
            ],
        }, {
            $set: { isSeen: true },
        });
    }
    else {
        result = yield notification_model_1.Notification.updateMany({
            $and: [
                { adminAcknowledgement: { $eq: false } },
                // { sentBy: { $ne: userId } }
            ],
        }, {
            $set: { adminAcknowledgement: true },
        });
    }
    return result;
});
exports.NotificationService = {
    createNotification,
    getSingleMessage,
    getAllNotification,
    updateNotificationSeenStatus,
};
