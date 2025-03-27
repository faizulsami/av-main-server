import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";
import swaggerOptions from "./config/swagger";
import swaggerDocument from "../openapi.json";

const app: Application = express();

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
app.use(cors(corsOptions));

// ✅ Handle Preflight (OPTIONS) Requests
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  if (corsOptions.origin.includes(req.headers.origin as string)) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, PATCH, POST, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No content response for preflight
  }
  next();
});

app.use(cookieParser("secret"));

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, specs));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use("/api/v1", routes);

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
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

export default app;
