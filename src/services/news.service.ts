import { parse } from "node:path";
import { NewsModel, NewsDocument } from "../models/news.model";
import { ListResult, ProductListRequest } from "../types/query.types";
import { AppError } from "../utils/app.error";
import {
  buildSearchQuery,
  parseBoolean,
  parseProjection,
  parseSort,
} from "../utils/query.util";

const allowedSortFields = [
  "name",
  "price",
  "createdAt",
  "stock",
  "updatedAt",
] as const;
const allowedProjectionFields = [
  "_id",
  "name",
  "price",
  "desc",
  "category",
  "stock",
  "createdAt",
  "updatedAt",
] as const;
const allowedSearchFields = ["name", "desc", "category"] as const;

export const getAllNews = async (
  params: ProductListRequest,
): Promise<ListResult<NewsDocument>> => {
  const {
    page,
    limit,
    sort,
    fields,
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
  } = params;

  const filters: Record<string, unknown> = {};

  if (category) filters.category = category;
  const priceFilter: Record<string, unknown> = {};
  if (maxPrice) {
    const parsed = parseFloat(maxPrice);
    if (!isNaN(parsed)) priceFilter.$lte = parsed;
  }

  if (Object.keys(priceFilter).length > 0) {
    filters.price = priceFilter;
  }

  const inStockBool = parseBoolean(inStock);
  if (inStockBool !== null) {
    filters.stock = inStockBool ? { $gt: 0 } : 0;
  }

  const searchQuery = buildSearchQuery(search, [...allowedSearchFields]);
  const query: Record<string, unknown> = { ...filters, ...(searchQuery ?? {}) };

  const sortBy = parseSort(sort, [...allowedSortFields], "-createdAt");
  const projection = parseProjection(fields, [...allowedProjectionFields]);
  const skip = (page - 1) * limit;

  const findQuery = NewsModel.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);
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
) => {
  const newNews = await NewsModel.create({
    title,
    preview,
    content,
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
  const updatedNews = await NewsModel.findByIdAndUpdate(
    newsId,
    updateData,
    { new: true },
  );

  if (!updatedNews) {
    throw new AppError("News not found", 404);
  }

  return updatedNews;
}; 