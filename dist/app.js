"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookRouters_1 = __importDefault(require("./app/router/book/bookRouters"));
const borrowRoutes_1 = __importDefault(require("./app/router/borrow/borrowRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//allow request from all website
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/books", bookRouters_1.default);
app.use("/api/borrow", borrowRoutes_1.default);
//main route
app.get("/", (req, res) => {
    res.send("BookStack - A Library Management Server is Running");
});
//Not found
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route Not Found" });
});
//Global error handleing
app.use((error, req, res, next) => {
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
exports.default = app;
