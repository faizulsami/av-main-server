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
exports.AppointmentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const mongoose_1 = __importDefault(require("mongoose"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const appointments_model_1 = require("./appointments.model");
const moment_1 = __importDefault(require("moment"));
const createAppointment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const result = yield appointments_model_1.Appointment.create(payload);
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
const getSingleAppointment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield appointments_model_1.Appointment.findById(id);
});
const getAllAppointments = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { not, searchTerm } = filters, filtersData = __rest(filters, ["not", "searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    if (not) {
        if (not === "completed") {
            const today = (0, moment_1.default)().utc();
            const dayOfWeek = today.isoWeekday();
            const startOfWeek = today
                .clone()
                .subtract(dayOfWeek % 7, "days")
                .startOf("day");
            const endOfToday = today.clone().endOf("day");
            andConditions.push({ status: { $not: { $eq: not } } });
            andConditions.push({
                createdAt: {
                    $gte: startOfWeek,
                    $lte: endOfToday,
                },
            });
        }
        else {
            andConditions.push({ appointmentType: { $not: { $eq: not } } });
        }
    }
    // Dynamic sort needs  fields to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // If there is no condition , put {} to give all data
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield appointments_model_1.Appointment.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield appointments_model_1.Appointment.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateAppointment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointments_model_1.Appointment.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const deleteAppointmentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointments_model_1.Appointment.findByIdAndDelete(id);
    return result;
});
exports.AppointmentService = {
    createAppointment,
    getAllAppointments,
    getSingleAppointment,
    updateAppointment,
    deleteAppointmentFromDB,
};
