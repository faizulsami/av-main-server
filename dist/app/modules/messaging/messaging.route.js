"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const messaging_controller_1 = require("./messaging.controller");
const router = express_1.default.Router();
router.post("/create-message", messaging_controller_1.MessagingController.createMessage);
router.get("/:id", messaging_controller_1.MessagingController.getSingleMessage);
router.get("/", messaging_controller_1.MessagingController.getAllMessages);
router.put("/:id", messaging_controller_1.MessagingController.updateMessageSeenStatus);
// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.SUPER_ADMIN),
//   AcademicFacultyController.deleteFaculty
// );
exports.MessagingRoutes = router;
