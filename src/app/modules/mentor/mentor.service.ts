/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { SortOrder, Types } from "mongoose";

import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { User } from "../user/user.model";
import { mentorSearchableFields } from "./mentor.constant";
import { IMentor, IMentorFilters, IMentorSchedule } from "./mentor.interface";
import { Mentor } from "./mentor.model";
import { MentorSchedule } from "./mentorSchedule.model";

const getAllMentors = async (
  filters: IMentorFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IMentor[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: mentorSearchableFields.map((field) => ({
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

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Mentor.find(whereConditions)
    // .populate('academicSemester')
    // .populate('academicDepartment')
    .populate("scheduleId")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Mentor.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleMentor = async (userName: string): Promise<IMentor | null> => {
  const result = await Mentor.findOne({ userName: userName }).populate(
    "scheduleId"
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mentor not found !");
  }

  return result;
};

const updateMentor = async (
  userName: string,
  payload: Partial<IMentor>
): Promise<IMentor | null> => {
  const isExist = await Mentor.findOne({ userName });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mentor not found !");
  }

  const { name, ...mentorData } = payload;

  const updatedMentorData: Partial<IMentor> = { ...mentorData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach((key) => {
      const nameKey = `name.${key}` as keyof Partial<IMentor>; // `name.fisrtName`
      (updatedMentorData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Mentor.findOneAndUpdate(
    { userName },
    updatedMentorData,
    {
      new: true,
    }
  );
  return result;
};
const updateMentorSchedule = async (
  payload: Partial<IMentorSchedule>
): Promise<IMentorSchedule | null> => {
  const { userName } = payload;
  const isExist = await Mentor.findOne({ userName });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mentor not found !");
  }
  const { schedule } = payload;

  const result = await MentorSchedule.findOneAndUpdate(
    { userName },
    { userName: userName, schedule: schedule },
    {
      new: true,
    }
  );
  return result;
};

const rejectMentor = async (id: string): Promise<IMentor | null> => {
  const mentor = await Mentor.findByIdAndDelete(id);

  return mentor;
};

const deleteMentor = async (id: string): Promise<IMentor | null> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Delete mentor first
    const mentor = await Mentor.findOneAndDelete(
      { _id: new Types.ObjectId(id) },
      { session }
    );

    if (!mentor) {
      throw new ApiError(400, "Failed to delete mentor");
    }

    // Delete related user
    await User.deleteOne({ userName: mentor.userName }, { session });

    await session.commitTransaction();
    return mentor;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const MentorService = {
  getAllMentors,
  getSingleMentor,
  updateMentor,
  updateMentorSchedule,
  rejectMentor,
  deleteMentor,
};
