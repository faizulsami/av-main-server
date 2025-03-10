"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
require("./auth.swagger");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginZodSchema), auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
router.post('/change-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePasswordZodSchema), 
// auth(
//   ENUM_USER_ROLE.SUPER_ADMIN,
//   ENUM_USER_ROLE.ADMIN,
//   ENUM_USER_ROLE.FACULTY,
//   ENUM_USER_ROLE.STUDENT
// ),
auth_controller_1.AuthController.changePassword);
router.post('/forget-password', 
// validateRequest(AuthValidation.changePasswordZodSchema),
// auth(
//   ENUM_USER_ROLE.SUPER_ADMIN,
//   ENUM_USER_ROLE.ADMIN,
//   ENUM_USER_ROLE.FACULTY,
//   ENUM_USER_ROLE.STUDENT
// ),
auth_controller_1.AuthController.forgetPassword);
router.post('/email-verification', 
// validateRequest(AuthValidation.loginZodSchema),
auth_controller_1.AuthController.emailVerification);
router.post('/sign-up-jwt-verification', 
// validateRequest(AuthValidation.loginZodSchema),
auth_controller_1.AuthController.jwtVerification);
exports.AuthRoutes = router;
