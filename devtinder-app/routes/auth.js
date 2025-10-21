const bcrypt = require("bcrypt");
const User = require("../models/user");

const express = require("express");
const authRouter = express.Router();

const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validations");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, age } = req.body;
    validateSignUpData(req);
    // check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).json({ message: "User already exists, please use a different email" });
    }
    const bcryptPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: bcryptPassword,
      age
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
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(req);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("User found:", user);
    const token = user.getJWT(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000),
    });
    const allowedFields = ["_id", "firstName", "lastName", "email", "age"];
    const filteredUser = {};
    const userObject = user.toObject();
    Object.keys(userObject).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUser[key] = user[key];
      }
    });
    res.json({ data: filteredUser });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

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
