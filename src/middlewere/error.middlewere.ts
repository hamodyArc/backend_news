import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/app.error";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  void req;
  void next;

  let statusCode = 500;
  let message = "Server Error";
  let details: unknown;
  let errors:
    | Array<{ path: string; message: string; code?: string }>
    | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({ message, details, errors });
};
