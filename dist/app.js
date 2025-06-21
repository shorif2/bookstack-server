"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookRouters_1 = __importDefault(require("./app/router/book/bookRouters"));
const borrowRoutes_1 = __importDefault(require("./app/router/borrow/borrowRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/books", bookRouters_1.default);
app.use("/api/borrow", borrowRoutes_1.default);
//main route
app.get("/", (req, res) => {
    res.send("BookStack - A Library Management Server is Running");
});
//Not found
app.use((req, res, next) => {
    res.status(404).json({ message: "Route Not Found" });
});
//Global error handleing
app.use((error, req, res, next) => {
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
exports.default = app;
