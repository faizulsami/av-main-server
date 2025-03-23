import express from "express";

import { CommunityController } from "./community.controller";

const router = express.Router();

router.post("/create-post", CommunityController.createCommunityPost);
router.put("/add-comment/:id", CommunityController.createCommunityPostComment);
router.put("/add-vote/:id", CommunityController.addVote);
router.get(
  "/:id",

  CommunityController.getCommunityPost
);

router.get(
  "/",

  CommunityController.getAllCommunityPosts
);

router.delete("/:id", CommunityController.deleteCommunityPost);

export const CommunityRoutes = router;
