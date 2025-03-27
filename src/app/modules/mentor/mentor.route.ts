import express from "express";

import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { MentorController } from "./mentor.controller";
import { MentorValidation } from "./mentor.validation";

const router = express.Router();

router.get(
  "/:userName",
  // auth(
  //   ENUM_USER_ROLE.SUPER_ADMIN,
  //   ENUM_USER_ROLE.ADMIN,
  //   ENUM_USER_ROLE.FACULTY,
  //   ENUM_USER_ROLE.FACULTY,
  //   ENUM_USER_ROLE.MENTOR
  // ),
  MentorController.getSingleMentor
);
router.put(
  "/:id/reject",
  // auth(ENUM_USER_ROLE.SUPER_ADMIN),
  MentorController.rejectMentor
);
router.delete(
  "/:id",
  // auth(ENUM_USER_ROLE.SUPER_ADMIN),
  MentorController.deleteMentor
);

router.put("/schedule", MentorController.updateMentorSchedule);
router.put("/:userName", MentorController.updateMentor);
router.get(
  "/",
  // auth(
  //   ENUM_USER_ROLE.SUPER_ADMIN,
  //   ENUM_USER_ROLE.ADMIN,
  //   ENUM_USER_ROLE.FACULTY,
  //   ENUM_USER_ROLE.FACULTY,
  //   ENUM_USER_ROLE.MENTOR
  // ),
  MentorController.getAllMentors
);

export const MentorRoutes = router;
// git remote set-url origin https://github.com/AbtahiHasan/anonymous-voice-client.git
// git remote set-url origin https://github.com/AbtahiHasan/anonymous-voice-server.git
