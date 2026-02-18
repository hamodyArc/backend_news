import express, { type Request, type Response } from "express";
import console = require("node:console");
import cors from "cors";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewere/error.middlewere";
import newsRoutes from "./routes/news.routes";
import authRoutes from "./routes/auth.routes";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use(express.json());

  app.use("/api", authRoutes);
  app.use("/api", userRoutes);
  app.use("/api", newsRoutes);

  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use(errorHandler);

  return app;
};
