"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
require("./user.swagger");
const router = express_1.default.Router();
router.post('/create-mentee', (0, validateRequest_1.default)(user_validation_1.UserValidation.createMenteeZodSchema), 
// auth( ENUM_USER_ROLE.MENTEE),
user_controller_1.UserController.createMentee);
router.post('/create-mentor', 
// validateRequest(UserValidation.createAdminZodSchema),
// auth( ENUM_USER_ROLE.MENTOR),
user_controller_1.UserController.createMentor);
router.post('/is-username-duplicate', 
// validateRequest(UserValidation.createAdminZodSchema),
// auth( ENUM_USER_ROLE.MENTOR),
user_controller_1.UserController.isUsernameDuplicateController);
router.post('/create-admin', 
// validateRequest(UserValidation.createAdminZodSchema),
// auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
user_controller_1.UserController.createAdmin);
router.get('/:id', user_controller_1.UserController.getSpecificUser);
// router.post(
//   '/image-upload',
//   // validateRequest(UserValidation.createAdminZodSchema),
//   // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//    UserController.imageUpload
// );
exports.UserRoutes = router;
