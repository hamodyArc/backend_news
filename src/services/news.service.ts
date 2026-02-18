import { parse } from "node:path";
import { NewsModel, NewsDocument } from "../models/news.model";
import { UserModel } from "../models/user.model";
import { ListResult, ProductListRequest } from "../types/query.types";
import { AppError } from "../utils/app.error";
import {
  buildSearchQuery,
  parseBoolean,
  parseProjection,
  parseSort,
} from "../utils/query.util";
import mongoose from "mongoose";

const allowedSortFields = ["title", "createdAt", "updatedAt"] as const;
const allowedProjectionFields = [
  "_id",
  "title",
  "preview",
  "content",
  "category",
  "author",
  "createdAt",
  "updatedAt",
] as const;
const allowedSearchFields = ["title", "preview", "content"] as const;

export const getAllNews = async (
  params: ProductListRequest,
): Promise<ListResult<NewsDocument>> => {
  const { page, limit, sort, fields, search } = params;

  const filters: Record<string, unknown> = {};

  const searchQuery = buildSearchQuery(search, [...allowedSearchFields]);
  const query: Record<string, unknown> = { ...filters, ...(searchQuery ?? {}) };

  const sortBy = parseSort(sort, [...allowedSortFields], "-createdAt");
  const projection = parseProjection(fields, [...allowedProjectionFields]);
  const skip = (page - 1) * limit;

  const findQuery = NewsModel.find(query).sort(sortBy).skip(skip).limit(limit);
  if (projection) findQuery.select(projection);

  const [data, total] = await Promise.all([
    findQuery.exec(),
    NewsModel.countDocuments(query).exec(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const getNewsByIdServices = async (id: string) => {
  const news = await NewsModel.findById(id);
  if (!news) {
    throw new AppError("News not found", 404);
  }
  return news;
};

export const createNews = async (
  title: string,
  preview: string,
  content: string,
  category?: string,
  author?: string,
) => {
  const newNews = await NewsModel.create({
    title,
    preview,
    content,
    category,
    author,
  });

  return newNews;
};

export const validateNewsOwnership = (
  newsUserId: string,
  currentUserId: string,
  role: string,
) => {
  if (newsUserId !== currentUserId && role !== "admin") {
    throw new AppError("Not your news", 403);
  }
};

export const updateNews = async (
  newsId: string,
  updateData: Partial<NewsDocument>,
) => {
  const updatedNews = await NewsModel.findByIdAndUpdate(newsId, updateData, {
    new: true,
  });

  if (!updatedNews) {
    throw new AppError("News not found", 404);
  }

  return updatedNews;
};

export const saveNewsForUser = async (
  userId: string,
  newsId: string,
): Promise<any> => {
  const news = await NewsModel.findById(newsId);
  if (!news) {
    throw new AppError("News not found", 404);
  }

  const newsObjectId = new mongoose.Types.ObjectId(newsId);

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $addToSet: { savedNews: newsObjectId },
    },
    { new: true },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    message: "News saved successfully",
    data: news,
  };
};

export const unsaveNewsForUser = async (
  userId: string,
  newsId: string,
): Promise<any> => {
  const newsObjectId = new mongoose.Types.ObjectId(newsId);

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $pull: { savedNews: newsObjectId },
    },
    { new: true },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    message: "News removed from saved",
    data: user,
  };
};

export const getSavedNewsForUser = async (
  userId: string,
  params: ProductListRequest,
): Promise<ListResult<NewsDocument>> => {
  const { page, limit, sort, fields } = params;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const sortBy = parseSort(
    sort,
    ["createdAt", "updatedAt", "title"],
    "-createdAt",
  );
  const projection = parseProjection(fields, [
    "_id",
    "title",
    "preview",
    "content",
    "category",
    "author",
    "createdAt",
    "updatedAt",
  ]);
  const skip = (page - 1) * limit;

  const findQuery = NewsModel.find({ _id: { $in: user.savedNews } })
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  if (projection) findQuery.select(projection);

  const [data, total] = await Promise.all([
    findQuery.exec(),
    NewsModel.countDocuments({ _id: { $in: user.savedNews } }).exec(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};
