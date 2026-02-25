import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import AppError from "./utils/AppError.js";
connectDB();

{
  /* Routes */
}
import authRoutes from "./routes/auth.route.js";
import friendRoutes from "./routes/friend.route.js";
import chatRoutes from "./routes/chat.route.js";
import { FRONTEND_URL } from "./config/constants.js";
const app = express();
app.use(
  cors({
    credentials: true,
    origin:FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => res.sendStatus(200));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/friend", friendRoutes);
app.use("/api/v1/chat", chatRoutes);

app.all("/{*path}", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});
app.use(errorHandler);

export default app;
