import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/index.js";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRouter);

// Api Endpoint NotFound Handler

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Api Endpoint Not Found",
  });
});

export default app;
