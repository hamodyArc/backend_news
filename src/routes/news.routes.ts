import { Router } from "express";
import { getAllProductsController } from "../controllers/news.controllers";
import { createNewsController } from "../controllers/news.controllers";
import { getNewsByIdController } from "../controllers/news.controllers";
import { patchNewsController } from "../controllers/news.controllers";
import { validate } from "../middlewere/validate.middlewere";
import { createNewsValidation } from "../models/news.model";
import { protect, restrictTo } from "../middlewere/auth.middlewere";

const router = Router();

router.patch("/news/:id", protect, restrictTo("admin"));
router.get("/news", getAllProductsController);
router.get("/news/:id", getNewsByIdController);
router.post(
  "/news",
  validate(createNewsValidation),
  protect,
  restrictTo("admin"),
  createNewsController,
);

export default router;
