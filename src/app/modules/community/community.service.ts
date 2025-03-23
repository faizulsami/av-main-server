/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from "mongoose";

import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";

import { IComment, ICommunity } from "./community.interfaces";
import Community from "./community.model";

const createCommunityPost = async (payload: ICommunity) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await Community.create(payload);

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
const createCommunityPostComment = async (
  postId: string,
  comment: IComment
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedPost = await Community.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: { $each: [comment], $position: 0 }, // Push to the front
        },
      },
      { new: true, runValidators: true }
    );

    await session.commitTransaction();
    await session.endSession();
    return updatedPost;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
const addVote = async (postId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedPost = await Community.findByIdAndUpdate(postId, {
      $inc: { votes: 1 },
    });

    await session.commitTransaction();
    await session.endSession();
    return updatedPost;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getCommunityPost = async (id: string): Promise<ICommunity | null> => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) return await Community.findById(id);
  else return null;
};

const getAllCommunityPosts = async (
  filters: ICommunity,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICommunity[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

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

  // Dynamic sort needs  fields to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // If there is no condition , put {} to give all data
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Community.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Community.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteCommunityPost = async (id: string): Promise<ICommunity | null> => {
  const result = await Community.findByIdAndDelete(id);
  return result;
};

export const CommunityService = {
  createCommunityPost,
  createCommunityPostComment,
  addVote,
  getAllCommunityPosts,
  getCommunityPost,

  deleteCommunityPost,
};
