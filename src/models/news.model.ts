import mongoose, { mongo } from "mongoose";
import {z} from "zod";

export interface NewsDocument {
  title: string;
  preview: string;
  category?: string;
  content: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const createNewsValidation = z.object({
  body: z.object({
    title: z.string("please Enter a valid title").min(2).max(100),
    preview: z.string("please Enter a valid preview").min(2).max(100),
    content: z.string("please Enter a valid content").min(2).max(100),
  }),
});



export type NewsTypeZ = z.infer<typeof createNewsValidation>["body"];

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    preview: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String },
    author: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const NewsModel = mongoose.model<NewsDocument>("News", newsSchema);
