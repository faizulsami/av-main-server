"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mentor_controller_1 = require("./mentor.controller");
const router = express_1.default.Router();
router.get("/:userName", 
// auth(
//   ENUM_USER_ROLE.SUPER_ADMIN,
//   ENUM_USER_ROLE.ADMIN,
//   ENUM_USER_ROLE.FACULTY,
//   ENUM_USER_ROLE.FACULTY,
//   ENUM_USER_ROLE.MENTOR
// ),
mentor_controller_1.MentorController.getSingleMentor);
router.put("/:id/reject", 
// auth(ENUM_USER_ROLE.SUPER_ADMIN),
mentor_controller_1.MentorController.rejectMentor);
router.delete("/:id", 
// auth(ENUM_USER_ROLE.SUPER_ADMIN),
mentor_controller_1.MentorController.deleteMentor);
router.put("/schedule", mentor_controller_1.MentorController.updateMentorSchedule);
router.put("/:userName", mentor_controller_1.MentorController.updateMentor);
router.get("/", 
// auth(
//   ENUM_USER_ROLE.SUPER_ADMIN,
//   ENUM_USER_ROLE.ADMIN,
//   ENUM_USER_ROLE.FACULTY,
//   ENUM_USER_ROLE.FACULTY,
//   ENUM_USER_ROLE.MENTOR
// ),
mentor_controller_1.MentorController.getAllMentors);
exports.MentorRoutes = router;
