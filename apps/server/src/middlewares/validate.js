import { body } from "express-validator";

export const userValidator = [
  body("username")
    .trim()
    .isLength({ min: 5, max: 20 })
    .escape()
    .withMessage("username must be between 5 and 20 characters"),
  body("password")
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage("password must be between 5 and 20 characters"),
  body("role")
    .isIn(["admin", "user"])
    .withMessage("role must be admin or user"),
];
