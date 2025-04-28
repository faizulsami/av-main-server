/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { SortOrder } from "mongoose";

import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IAppointment, IAppointmentFilters } from "./appointments.interfaces";
import { Appointment } from "./appointments.model";
import moment from "moment";
const createAppointment = async (payload: IAppointment) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await Appointment.create(payload);

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getSingleAppointment = async (
  id: string
): Promise<IAppointment | null> => {
  return await Appointment.findById(id);
};

const getAllAppointments = async (
  filters: IAppointmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAppointment[]>> => {
  const { not, searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any = [];

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  if (not) {
    if (not === "completed") {
      const today = moment().utc();
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
    } else {
      andConditions.push({ appointmentType: { $not: { $eq: not } } });
    }
  }
  // Dynamic sort needs  fields to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // If there is no condition , put {} to give all data
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Appointment.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Appointment.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllAppointmentsByUsername = async(username:string) => {
  const result = await Appointment.find({ menteeUserName: username });

  return result;
}

const updateAppointment = async (
  id: string,
  payload: Partial<IAppointment>
): Promise<IAppointment | null> => {
  const result = await Appointment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteAppointmentFromDB = async (
  id: string
): Promise<IAppointment | null> => {
  const result = await Appointment.findByIdAndDelete(id);
  return result;
};

export const AppointmentService = {
  createAppointment,
  getAllAppointments,
  getSingleAppointment,
  updateAppointment,
  deleteAppointmentFromDB,
  getAllAppointmentsByUsername
};
