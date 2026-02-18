import mongoose, { mongo, Document } from "mongoose";
import { z } from "zod";
import { UserRole } from "../types/user.models";

export interface UserDocument extends Document {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  savedNews: mongoose.Schema.Types.ObjectId[];
}

export const createUserValidation = z.object({
  body: z.object({
    name: z.string("please Enter a valid name").min(2).max(100),
    email: z.string("please Enter a valid email").email(),
    job: z.string("please Enter a valid job").min(2).max(100),
    password: z.string("please Enter a valid password").min(6),
    isAdmin: z.boolean().optional(),
  }),
});

export type CreateUserTypeZ = z.infer<typeof createUserValidation>["body"];

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, select: false },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  savedNews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
    },
  ],
});

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
