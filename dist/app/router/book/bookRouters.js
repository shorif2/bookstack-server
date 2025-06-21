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
const bookModel_1 = require("../../models/bookModel");
const bookRouter = express_1.default.Router();
// book create router
bookRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = req.body;
        const createdBook = yield bookModel_1.Book.create(book);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: createdBook,
        });
    }
    catch (error) {
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
}));
// Get all books route
bookRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit } = req.query;
        const query = {};
        if (filter) {
            query.genre = { $regex: new RegExp(filter, "i") };
        }
        const sortField = sortBy;
        const sortOrder = sort === "asc" ? 1 : -1;
        const maxResults = parseInt(limit, 10);
        const books = yield bookModel_1.Book.find(query)
            .sort({ [sortField]: sortOrder })
            .limit(maxResults);
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        next(error);
    }
}));
//Get single book route
bookRouter.get("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield bookModel_1.Book.findById(bookId);
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
//Update Books route
bookRouter.put("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updateInfo = req.body;
        const updatedBook = yield bookModel_1.Book.findByIdAndUpdate(bookId, updateInfo, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Book update successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        next(error);
    }
}));
//Delete Book route
bookRouter.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const deleteBook = yield bookModel_1.Book.findOneAndDelete({ _id: bookId });
        if (!deleteBook) {
            const error = new Error("Book not found or already deleted");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = bookRouter;
