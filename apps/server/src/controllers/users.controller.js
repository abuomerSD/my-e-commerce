import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const findAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: true,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const saveUser = async (req, res) => {
  const { username, password, role } = req.body;

  //   validation errors
  const validationsErrors = validationResult(req);

  if (!validationsErrors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      message: "validation error",
      errors: validationsErrors.array(),
    });
  }

  try {
    //   Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save().then((createdUser) => {
      res.status(201).json({
        status: "success",
        data: createdUser,
      });
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const findUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "please provide the user id",
    });
  }

  try {
    const user = await User.findById(id);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "please provide the user id",
    });
  }

  try {
    const { username, password, role } = req.body;
    const validationsErrors = validationResult(req);

    const { id } = req.params;

    // check for the id
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "please provide the user id",
      });
    }

    // validate user
    if (!validationsErrors.isEmpty()) {
      return res.status(400).json({
        status: "fail",
        message: "validation error",
        errors: validationsErrors.array(),
      });
    }

    const newUser = { username, password, role };

    const updateUser = await User.findOneAndUpdate({ _id: id }, newUser);
    res.status(200).json({
      status: "success",
      data: updateUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;

  // check for the id
  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "please provide the user id",
    });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ _id: id });
    res.status(200).json({
      status: "success",
      data: deletedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
