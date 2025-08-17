import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

export const connectDb = async () => {
  await mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log(err);
    });
};
