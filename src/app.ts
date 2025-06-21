import express, { Application, NextFunction, Request, Response } from "express";
import bookRouter from "./app/router/book/bookRouters";
import borrowRoute from "./app/router/borrow/borrowRoutes";
import dotenv from "dotenv";
dotenv.config();
const app: Application = express();

app.use(express.json());
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRoute);

//main route
app.get("/", (req: Request, res: Response) => {
  res.send("BookStack - A Library Management Server is Running");
});

//Not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route Not Found" });
});

//Global error handleing
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong";

  if (error.name === "ValidationError") {
    message = "Validation failed";
  }
  res.status(statusCode).json({
    success: false,
    message: error.message,
    error,
  });
});
export default app;
