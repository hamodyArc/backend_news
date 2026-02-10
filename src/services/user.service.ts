import { UserModel, UserDocument } from "../models/user.model";
import { AppError } from "../utils/app.error";
import bcrypt from "bcrypt";

export const getAllUsers = async () => {
  const users = await UserModel.find();
  if (!users || users.length === 0) {
    throw new AppError("No users found", 404);
  }
  return users;
};

export const getUserByIdServices = async (id: string) => {
  const users = await UserModel.findById(id);
  if (!users) {
    throw new AppError("User not found", 404);
  }
  return users;
};

export const createUser = async (email: string, password: string) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({
    email,
    password: hashedPassword,
    role: "user",
  });

  return newUser;
};

export const deleteUser = async (id: string) => {
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
