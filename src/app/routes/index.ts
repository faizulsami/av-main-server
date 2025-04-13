import express from 'express';

import { AppointmentRoutes } from '../modules/appointment/appointments.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { CategoriesRoutes } from '../modules/category/categories.route';
import { FileUploadRoutes } from '../modules/fileUpload/fileUPload.route';
import { MentorRoutes } from '../modules/mentor/mentor.route';
import { MessagingRoutes } from '../modules/messaging/messaging.route';
import { NotificationRoutes } from '../modules/notification/notification.route';
import { UserRoutes } from '../modules/user/user.route';
import { UserDetailsRoutes } from '../modules/userDetails/userDetails.route';
import { CommunityRoutes } from '../modules/community/community.route';
import { newsletterRoutes } from '../modules/newsletter/newsletter.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/newsletter',
    route: newsletterRoutes,
  },
  {
    path: '/mentors',
    route: MentorRoutes,
  },
  {
    path: '/appointments',
    route: AppointmentRoutes,
  },
  {
    path: '/userDetails',
    route: UserDetailsRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/message',
    route: MessagingRoutes,
  },

  {
    path: '/blog-post',
    route: BlogRoutes,
  },
  {
    path: '/categories',
    route: CategoriesRoutes,
  },
  // {
  //   path: "/file-upload",
  //   route: FileUploadRoutes,
  // },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/community',
    route: CommunityRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
