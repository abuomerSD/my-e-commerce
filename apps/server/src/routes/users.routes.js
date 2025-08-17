import express from "express";
const router = express.Router();
import {
  deleteUserById,
  findUserById,
  findAllUsers,
  saveUser,
  updateUserById,
} from "../controllers/users.controller.js";
import { userValidator } from "../middlewares/validate.js";

router.route("/").get(findAllUsers).post(userValidator, saveUser);
router
  .route("/:id")
  .get(findUserById)
  .put(userValidator, updateUserById)
  .delete(deleteUserById);

export default router;
