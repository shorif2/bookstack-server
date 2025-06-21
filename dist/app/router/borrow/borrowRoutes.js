"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrowModel_1 = require("../../models/borrowModel");
const bookModel_1 = require("../../models/bookModel");
const borrowRoute = express_1.default.Router();
borrowRoute.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity } = req.body;
        const book = yield bookModel_1.Book.findById(bookId);
        if (!book)
            throw new Error("Book not found!");
        if (book.copies < quantity)
            throw new Error("Not enough books in stock");
        book.copies -= quantity;
        if (book.copies === 0) {
            book.updateAvailability();
        }
        yield book.save();
        const borrowBook = yield borrowModel_1.Borrow.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowBook,
        });
    }
    catch (error) {
        next(error);
    }
}));
borrowRoute.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowBook = yield borrowModel_1.Borrow.aggregate([
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
    }
    catch (error) {
        next(error);
    }
}));
exports.default = borrowRoute;
