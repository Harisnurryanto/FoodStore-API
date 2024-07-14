import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";

export const web = express();
web.use(cors({ credentials: true, origin: "http://localhost:5173" }));
web.use(express.json());
web.use(cookieParser());

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);
