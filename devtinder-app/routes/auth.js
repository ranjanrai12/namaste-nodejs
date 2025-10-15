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
    const { firstName, lastName, email, password } = req.body;
    validateSignUpData(req);
    const bcryptPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", bcryptPassword);
    const user = new User({
      firstName,
      lastName,
      email,
      password: bcryptPassword,
    });
    await user.save();
    // Validate the signup data before saving
    res.send("User created successfully");
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
      throw new Error("Invalid email or password");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
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
