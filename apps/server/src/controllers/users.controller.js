import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const findAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      status: true,
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const registerUser = async (req, res) => {
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

    // create jwt token
    const expireTime = JWT_EXPIRES_IN * 24 * 60 * 1000;
    const token = jwt.sign({ username, hashedPassword, role }, JWT_SECRET, {
      expiresIn: expireTime,
    });

    res.cookie("jwt", token);

    await user.save().then((createdUser) => {
      return res.status(201).json({
        status: "success",
        data: createdUser,
      });
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "fail",
      message: "username and password is required",
    });
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const expiresIn = JWT_EXPIRES_IN * 24 * 60 * 1000;
        const token = jwt.sign(
          { username: user.username, password: user.password, role: user.role },
          JWT_SECRET,
          {
            expiresIn,
          }
        );
        res.cookie("jwt", token, {
          maxAge: expiresIn,
          httpOnly: true,
        });

        return res.status(200).json({
          status: "success",
          data: {
            user,
            token,
          },
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "password not correct",
        });
      }
    } else {
      return res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "fail",
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
    if (user) {
      return res.status(200).json({
        status: "success",
        data: user,
      });
    }
    return res.status(404).json({
      status: "fail",
      message: "user not found",
    });
  } catch (error) {
    return res.status(400).json({
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

    // hashing the password

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, password: hashedPassword, role };

    const updateUser = await User.findOneAndUpdate({ _id: id }, newUser);
    return res.status(200).json({
      status: "success",
      data: updateUser,
    });
  } catch (error) {
    return res.status(400).json({
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
    return res.status(200).json({
      status: "success",
      data: deletedUser,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
