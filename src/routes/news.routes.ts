import { Router } from "express";
import { getAllProductsController } from "../controllers/news.controllers";
import { createNewsController } from "../controllers/news.controllers";
import { getNewsByIdController } from "../controllers/news.controllers";
import { getSavedProductsController } from "../controllers/news.controllers";
import { saveNewsController } from "../controllers/news.controllers";
import { unsaveNewsController } from "../controllers/news.controllers";
import { patchNewsController } from "../controllers/news.controllers";
import { validate } from "../middlewere/validate.middlewere";
import { createNewsValidation } from "../models/news.model";
import { protect, restrictTo } from "../middlewere/auth.middlewere";

const router = Router();

router.get("/news/saved", protect, getSavedProductsController);
router.post("/news/:id/save", protect, saveNewsController);
router.delete("/news/:id/save", protect, unsaveNewsController);

router.get("/news", getAllProductsController);
router.get("/news/:id", getNewsByIdController);
router.post(
  "/news",
  validate(createNewsValidation),
  protect,
  restrictTo("admin"),
  createNewsController,
);
router.patch("/news/:id", protect, restrictTo("admin"), patchNewsController);

export default router;
