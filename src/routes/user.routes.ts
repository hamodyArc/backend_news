import { Router } from "express";
import {
  createUserController,
  getUserByIdController,
  getAllUsersController,
  deleteUserController,
} from "../controllers/user.controller";
import { validate } from "../middlewere/validate.middlewere";
import { createUserValidation } from "../models/user.model";
import { protect, restrictTo } from "../middlewere/auth.middlewere";

const router = Router();

router.get("/user", getAllUsersController);
router.get("/user/:id", getUserByIdController);
router.post("/user", createUserController);
router.delete(
  "/",
  protect,
  restrictTo("admin"),
  deleteUserController,
);

export default router;
