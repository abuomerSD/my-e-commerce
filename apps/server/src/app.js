import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/index.js";
import { CORS_ORIGIN } from "./config/env.js";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", userRouter);

// Api Endpoint NotFound Handler

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Api Endpoint Not Found",
  });
});

export default app;
