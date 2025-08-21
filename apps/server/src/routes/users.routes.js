import express from "express";
const router = express.Router();
import {
  deleteUserById,
  findUserById,
  findAllUsers,
  registerUser,
  updateUserById,
  loginUser,
} from "../controllers/users.controller.js";
import { userValidator } from "../middlewares/validate.js";

router.route("/users").get(findAllUsers).post(userValidator, registerUser);
router
  .route("/users/:id")
  .get(findUserById)
  .put(userValidator, updateUserById)
  .delete(deleteUserById);
router.route("/login").post(loginUser);

export default router;
