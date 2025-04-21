"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUpload_controller_1 = require("./fileUpload.controller");
const path = require('path');
const router = express_1.default.Router();
router.post('/', 
// validateRequest(UserValidation.createAdminZodSchema),
// auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
fileUpload_controller_1.FileUploadController.imageUpload);
exports.FileUploadRoutes = router;
