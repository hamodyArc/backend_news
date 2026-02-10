import { UserDocument, UserModel } from "../models/user.model";
import { AppError } from "../utils/app.error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authenticateUser = async (email: string) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }
  return user;
};

export const comparePassword = async (password: string, user: UserDocument) => {
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }
};

export const generateToken = (user: UserDocument) => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role, 
    },
    process.env.JWT_SECRET!,
  );

  return token;
};

export const login = async (body: { email: string; password: string }) => {
  const user = await authenticateUser(body.email);
  await comparePassword(body.password, user);
  const token = generateToken(user);
  return token;
};
