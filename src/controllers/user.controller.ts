import { Request, Response } from "express";
import * as UserService from "../services/user.service";
import { CreateUserTypeZ } from "../models/user.model";
import { NextFunction } from "express";

export const getAllUsersController = async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.status(200).json(users);
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await UserService.getUserByIdServices(id);
  res.status(200).json(user);
};

export const createUserController = async (
  req: Request<{}, {}, CreateUserTypeZ>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const newUser = await UserService.createUser(email, password);

    res.status(201).json({
      status: "User Created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

interface createUserType {
  name: string;
  email: string;
  job: string;
}

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    await UserService.deleteUser(id);

    res.status(200).json({
      status: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
