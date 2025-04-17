"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const categories_controller_1 = require("./categories.controller");
const router = express_1.default.Router();
router.post("/create-categories", categories_controller_1.CategoriesController.createCategories);
// router.get(
//   "/:id",
//   CategoriesController.getSingleCategories
// );
router.get("/", categories_controller_1.CategoriesController.getAllCategories);
router.put("/:id", categories_controller_1.CategoriesController.updateCategories);
// router.delete(
//   "/:id",
//   // auth(ENUM_USER_ROLE.SUPER_ADMIN),
//   CategoriesController.deleteCategories
// );
exports.CategoriesRoutes = router;
