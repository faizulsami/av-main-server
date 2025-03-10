"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetailsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userDetails_controller_1 = require("./userDetails.controller");
const router = express_1.default.Router();
router.get('/:id', 
// auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
userDetails_controller_1.UserDetailsController.getSingleUserDetails);
// router.get(
//   '/',
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   AdminController.getAllAdmins
// );
router.patch('/:id', 
// validateRequest(AdminValidation.updateAdmin),
// auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
userDetails_controller_1.UserDetailsController.updateUserDetails);
// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.SUPER_ADMIN),
//   AdminController.deleteAdmin
// );
exports.UserDetailsRoutes = router;
