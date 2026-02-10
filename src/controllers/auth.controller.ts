import type { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = await AuthService.login(req.body);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
