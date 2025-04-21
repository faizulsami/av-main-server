"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const appointments_controller_1 = require("./appointments.controller");
const router = express_1.default.Router();
router.post("/create-appointment", appointments_controller_1.AppointmentController.createAppointment);
router.get("/:id", appointments_controller_1.AppointmentController.getSingleAppointment);
router.get("/", appointments_controller_1.AppointmentController.getAllAppointments);
router.put("/:id", 
// validateRequest(AcademicFacultyValidation.updatefacultyZodSchema),
// auth(
//   ENUM_USER_ROLE.SUPER_ADMIN,
//   ENUM_USER_ROLE.ADMIN,
//   ENUM_USER_ROLE.FACULTY
// ),
appointments_controller_1.AppointmentController.updateAppointment);
router.delete("/:id", 
// auth(ENUM_USER_ROLE.SUPER_ADMIN),
appointments_controller_1.AppointmentController.deleteAppointment);
exports.AppointmentRoutes = router;
