import type { Request, Response } from "express";
import { NewsTypeZ } from "../models/news.model";
import { NextFunction } from "express";
import * as ProductService from "../services/news.service";
import {
  ProductListQueryParams,
  ProductListRequest,
} from "../types/query.types";
import {
  capLimit,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  toPositiveInteger,
} from "../utils/query.util";

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
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
    } = req.query as ProductListQueryParams;

    const pageNumber = toPositiveInteger(page, DEFAULT_PAGE);
    const limitNumber = capLimit(toPositiveInteger(limit, DEFAULT_LIMIT));
    const options: ProductListRequest = {
      page: pageNumber,
      limit: limitNumber,
      sort,
      fields,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
    };

    const products = await ProductService.getAllNews(options);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNewsByIdController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const news = await ProductService.getNewsByIdServices(id);
  res.status(200).json(news);
};

export const createNewsController = async (
  req: Request<{}, {}, NewsTypeZ>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, preview, content } = req.body;
    const newNews = await ProductService.createNews(title, preview, content);

    res.status(201).json({
      status: "News Created successfully",
      news: newNews,
    });
  } catch (error) {
    next(error);
  }
};

export const patchNewsController = async (
  req: Request<{ id: string }, {}, createNewsType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newsId = req.params.id;
    const { title, preview, content } = req.body;

    const updatedNews = await ProductService.updateNews(newsId, {
      title,
      preview,
      content,
    });

    res.status(200).json({
      status: "News updated successfully",
      news: updatedNews,
    });
  } catch (error) {
    next(error);
  }
};

interface createNewsType {
  title: string;
  preview: string;
  content: string;
}
