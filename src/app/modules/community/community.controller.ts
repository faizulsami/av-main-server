/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";

import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";

// import { IClientOrder } from './blog.interfaces';
import { ICommunity } from "./community.interfaces";
import { CommunityService } from "./community.service";
// import { clientOrderFilterableFields } from './clientOrder.constants';
// import { ClientServicesService } from './clientOrder.service';

const createCommunityPost = catchAsync(async (req: Request, res: Response) => {
  const { ...clientOrderData } = req.body;
  const result = await CommunityService.createCommunityPost(clientOrderData);
  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New Community Post created successfully",
    data: result,
  });
});
const createCommunityPostComment = catchAsync(
  async (req: Request, res: Response) => {
    const { ...clientOrderData } = req.body;
    const result = await CommunityService.createCommunityPostComment(
      req.params.id,
      clientOrderData
    );
    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Community Comment Post created successfully",
      data: result,
    });
  }
);

const getCommunityPost = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CommunityService.getCommunityPost(id);

  sendResponse<ICommunity>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Particular Community Post fetched successfully",
    data: result,
  });
});
const addVote = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CommunityService.addVote(id);

  sendResponse<ICommunity>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "voted  successfully",
    data: result,
  });
});

const getAllCommunityPosts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, []);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CommunityService.getAllCommunityPosts(
    filters as any,
    paginationOptions
  );

  sendResponse<ICommunity[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Community Posts fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteCommunityPost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CommunityService.deleteCommunityPost(id);

  sendResponse<ICommunity>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Community Post deleted successfully",
    data: result,
  });
});

export const CommunityController = {
  createCommunityPost,
  createCommunityPostComment,
  addVote,
  getCommunityPost,
  getAllCommunityPosts,
  deleteCommunityPost,
};
