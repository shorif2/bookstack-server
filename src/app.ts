import express, { Application, NextFunction, Request, Response } from "express";
import bookRouter from "./app/router/book/bookRouters";
import borrowRoute from "./app/router/borrow/borrowRoutes";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app: Application = express();

//allow request from all website
app.use(cors());
app.use(express.json());
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRoute);

//main route
app.get("/", (req: Request, res: Response) => {
  res.send("BookStack - A Library Management Server is Running");
});

//Not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

//Global error handleing
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";
  if (error) {
    res.status(statusCode).json({
      success: false,
      message: message,
      error,
    });
    return;
  }
  res.status(500).json({
    success: false,
    message: message,
  });
});
export default app;
