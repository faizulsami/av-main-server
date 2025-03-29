import express from "express";

import { CategoriesController } from "./categories.controller";

const router = express.Router();

router.post("/create-categories", CategoriesController.createCategories);

// router.get(
//   "/:id",

//   CategoriesController.getSingleCategories
// );

router.get("/", CategoriesController.getAllCategories);

router.put(
  "/:id",

  CategoriesController.updateCategories
);

// router.delete(
//   "/:id",
//   // auth(ENUM_USER_ROLE.SUPER_ADMIN),
//   CategoriesController.deleteCategories
// );

export const CategoriesRoutes = router;
