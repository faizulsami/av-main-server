"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityRoutes = void 0;
const express_1 = __importDefault(require("express"));
const community_controller_1 = require("./community.controller");
const router = express_1.default.Router();
router.post("/create-post", community_controller_1.CommunityController.createCommunityPost);
router.put("/add-comment/:id", community_controller_1.CommunityController.createCommunityPostComment);
router.put("/add-vote/:id", community_controller_1.CommunityController.addVote);
router.get("/:id", community_controller_1.CommunityController.getCommunityPost);
router.get("/", community_controller_1.CommunityController.getAllCommunityPosts);
router.delete("/:id", community_controller_1.CommunityController.deleteCommunityPost);
exports.CommunityRoutes = router;
