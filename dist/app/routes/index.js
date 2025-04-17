"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointments_route_1 = require("../modules/appointment/appointments.route");
const auth_route_1 = require("../modules/auth/auth.route");
const blog_route_1 = require("../modules/blog/blog.route");
const categories_route_1 = require("../modules/category/categories.route");
const mentor_route_1 = require("../modules/mentor/mentor.route");
const messaging_route_1 = require("../modules/messaging/messaging.route");
const notification_route_1 = require("../modules/notification/notification.route");
const user_route_1 = require("../modules/user/user.route");
const userDetails_route_1 = require("../modules/userDetails/userDetails.route");
const community_route_1 = require("../modules/community/community.route");
const newsletter_route_1 = require("../modules/newsletter/newsletter.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/newsletter',
        route: newsletter_route_1.newsletterRoutes,
    },
    {
        path: '/mentors',
        route: mentor_route_1.MentorRoutes,
    },
    {
        path: '/appointments',
        route: appointments_route_1.AppointmentRoutes,
    },
    {
        path: '/userDetails',
        route: userDetails_route_1.UserDetailsRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/message',
        route: messaging_route_1.MessagingRoutes,
    },
    {
        path: '/blog-post',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/categories',
        route: categories_route_1.CategoriesRoutes,
    },
    // {
    //   path: "/file-upload",
    //   route: FileUploadRoutes,
    // },
    {
        path: '/notifications',
        route: notification_route_1.NotificationRoutes,
    },
    {
        path: '/community',
        route: community_route_1.CommunityRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
