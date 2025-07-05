import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { Book } from "../../models/bookModel";

const bookRouter = express.Router();

// book create router
bookRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = req.body;
      const createdBook = await Book.create(book);
      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: createdBook,
      });
    } catch (error: any) {
      let message = error.message;
      if (error.name === "ValidationError") {
        message = "Validation failed";
      }
      res.status(501).json({
        success: false,
        message,
        error: {
          name: error.name,
          errors: error.errors,
        },
      });
    }
  }
);

// Get all books route
bookRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filter, sortBy = "createdAt", sort = "desc", limit } = req.query;
    const query: any = {};
    if (filter) {
      query.genre = { $regex: new RegExp(filter as string, "i") };
    }
    const sortField = sortBy as string;
    const sortOrder = sort === "asc" ? 1 : -1;
    const maxResults = parseInt(limit as string, 10);

    const books = await Book.find(query)
      .sort({ [sortField]: sortOrder })
      .limit(maxResults);

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
});

//Get single book route
bookRouter.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;

      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error("Book not found!");
      }
      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

//Update copies route
bookRouter.put(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;
      const { copies } = req.body;
      if (typeof copies !== "number") {
        throw new Error("Copies must be a number");
      }
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { $inc: { copies } },
        {
          new: true,
        }
      );
      if (!updatedBook) {
        throw new Error("Book not found");
      }

      res.status(200).json({
        success: true,
        message: "Book update successfully",
        data: updatedBook,
      });
    } catch (error) {
      next(error);
    }
  }
);
//Update Books route
bookRouter.patch(
  "/update/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;
      const bookInfo = req.body;

      if (!bookInfo || Object.keys(bookInfo).length === 0) {
        res.status(400).json({
          success: false,
          message: "No update data provided",
        });
      }
      if (typeof bookInfo?.copies !== "number") {
        throw new Error("Copies must be a number");
      }
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { ...bookInfo, available: true },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedBook) {
        throw new Error("Book not found");
      }

      res.status(200).json({
        success: true,
        message: "Book update successfully",
        data: updatedBook,
      });
    } catch (error) {
      next(error);
    }
  }
);

//Delete Book route
bookRouter.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;
      const deleteBook = await Book.findOneAndDelete({ _id: bookId });
      if (!deleteBook) {
        const error = new Error("Book not found or already deleted");
        (error as any).statusCode = 404;
        throw error;
      }
      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default bookRouter;
