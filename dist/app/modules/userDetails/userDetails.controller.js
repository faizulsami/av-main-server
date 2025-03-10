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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetailsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const userDetails_service_1 = require("./userDetails.service");
const getSingleUserDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield userDetails_service_1.UserDetailsService.getSingleUserDetails(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User fetched successfully !',
        data: result,
    });
}));
// const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
//   const filters = pick(req.query, adminFilterableFields);
//   const paginationOptions = pick(req.query, paginationFields);
//   const result = await AdminService.getAllAdmins(filters, paginationOptions);
//   sendResponse<IAdmin[]>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Admins fetched successfully !',
//     meta: result.meta,
//     data: result.data,
//   });
// });
const updateUserDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    const result = yield userDetails_service_1.UserDetailsService.updateUserDetails(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'UserDetails updated successfully !',
        data: result,
    });
}));
// const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const result = await AdminService.deleteAdmin(id);
//   sendResponse<IAdmin>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Admin deleted successfully !',
//     data: result,
//   });
// });
exports.UserDetailsController = {
    getSingleUserDetails,
    updateUserDetails,
};
