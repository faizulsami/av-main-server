"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
router.post("/create-notification", notification_controller_1.NotificationController.createNotification);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.FACULTY), notification_controller_1.NotificationController.getSingleNotification);
router.get("/", notification_controller_1.NotificationController.getAllNotification);
router.patch("/:id", notification_controller_1.NotificationController.updateNotificationSeenStatus);
exports.NotificationRoutes = router;
