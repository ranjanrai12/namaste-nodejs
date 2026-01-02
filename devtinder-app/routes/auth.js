const bcrypt = require("bcrypt");
const User = require("../models/user");

const express = require("express");
const authRouter = express.Router();

const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validations");

/**
 * @route POST /auth/signup
 * @description Create a new user
 */
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route POST /auth/signup
 * @description Create a new user
 */
authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, age } = req.body;
    validateSignUpData(req);
    // check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error("User already exists, please use a different email");
      err.statusCode = 400;
      throw err;
    }
    const bcryptPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: bcryptPassword,
      age,
    });
    const savedUser = await user.save();
    const token = savedUser.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000),
    });
    res.json({ message: "User created successfully", data: savedUser });
  })
);
/**
 * @route POST /auth/login
 * @description Login user
 */
authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    validateLoginData(req);

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }
    const token = user.getJWT(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 3600000),
    });
    const allowedFields = [
      "_id",
      "firstName",
      "lastName",
      "email",
      "age",
      "photoUrl",
      "skills",
      "gender",
      "about",
    ];
    const filteredUser = {};
    const userObject = user.toObject();
    Object.keys(userObject).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUser[key] = user[key];
      }
    });
    res.json({ data: filteredUser });
  })
);
/**
 * @route POST /auth/logout
 * @description Logout user
 */
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(Date.now()),
    path: "/",
  });
  res.send("Logout successfully!");
});

module.exports = authRouter;
