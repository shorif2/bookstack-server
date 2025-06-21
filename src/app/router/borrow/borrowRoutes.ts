import express, { NextFunction, Request, Response } from "express";
import { Borrow } from "../../models/borrowModel";
import { Book } from "../../models/bookModel";

const borrowRoute = express.Router();

borrowRoute.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { book: bookId, quantity } = req.body;

      const book = await Book.findById(bookId);
      if (!book) throw new Error("Book not found!");

      if (book.copies < quantity) throw new Error("Not enough books in stock");

      book.copies -= quantity;
      if (book.copies === 0) {
        book.updateAvailability();
      }
      await book.save();
      const borrowBook = await Borrow.create(req.body);
      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrowBook,
      });
    } catch (error) {
      next(error);
    }
  }
);

borrowRoute.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrowBook = await Borrow.aggregate([
        {
          $group: {
            _id: "$book",
            totalQuantity: { $sum: "$quantity" },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        {
          $unwind: "$bookDetails",
        },
        {
          $project: {
            _id: 0,
            book: {
              title: "$bookDetails.title",
              isbn: "$bookDetails.isbn",
            },
            totalQuantity: 1,
          },
        },
      ]);
      res.status(201).json({
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data: borrowBook,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default borrowRoute;
