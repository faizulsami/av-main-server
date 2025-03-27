"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const swagger_1 = __importDefault(require("./config/swagger"));
const openapi_json_1 = __importDefault(require("../openapi.json"));
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: [
        "https://anonymousvoicesav.com",
        "https://www.anonymousvoicesav.com",
        "http://localhost:3000",
        "https://anonymous-voice.vercel.app",
        "https://anonymousvoicesav.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
// ✅ Enable CORS before any routes
app.use((0, cors_1.default)(corsOptions));
// ✅ Handle Preflight (OPTIONS) Requests
app.options("*", (0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    if (corsOptions.origin.includes(req.headers.origin)) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // No content response for preflight
    }
    next();
});
app.use((0, cookie_parser_1.default)("secret"));
const specs = (0, swagger_jsdoc_1.default)(swagger_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_json_1.default, specs));
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("uploads"));
app.use("/api/v1", routes_1.default);
//global error handler
app.use(globalErrorHandler_1.default);
//handle not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API Not Found",
            },
        ],
    });
    next();
});
exports.default = app;
