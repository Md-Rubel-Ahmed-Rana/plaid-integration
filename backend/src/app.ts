import express, { Application } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { AppRoutes } from "./routes";
import {
  expressMiddlewares,
  notFoundRoutes,
} from "./middlewares/expressMiddlewares";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// middlewares
expressMiddlewares(app);

// health check
app.get("/", async (req, res) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Plaid integration application is up and running...",
    data: {
      uptime: `${process.uptime().toFixed(2)} seconds`,
      timestamp: new Date().toLocaleString(),
    },
  });
});

// applications routes
app.use("/api/v1", AppRoutes);

// global error handler
app.use(globalErrorHandler.globalErrorHandler);

// app route not found
notFoundRoutes(app);

export default app;
