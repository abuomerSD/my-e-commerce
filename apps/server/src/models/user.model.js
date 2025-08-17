import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  role: String,
});

export const User = mongoose.model("User", userSchema);
