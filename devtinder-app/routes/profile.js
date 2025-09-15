const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validationProfileUpdateData } = require("../utils/validations");

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).send("Error fetching profile: " + err.message);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validationProfileUpdateData(req)) {
      throw new Error("Update not allowed");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    const updatedUserData = {
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      age: loggedInUser.age,
      gender: loggedInUser.gender,
      skills: loggedInUser.skills,
      country: loggedInUser.country,
    };
    res.json({
      message: `${loggedInUser.firstName} Your profile updated successfully`,
      data: updatedUserData,
    });
  } catch (err) {
    res.status(500).send("Error while updating profile: " + err.message);
  }
});

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { password } = req.body;
    const byCryptPassword = await bcrypt.hash(password, 10);
    const isPasswordSame = await bcrypt.compare(
      password,
      loggedInUser.password
    );
    if (isPasswordSame) {
      throw new Error("Old and new password cannot be same");
    }
    loggedInUser.password = byCryptPassword;
    await loggedInUser.save();
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now()),
    });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});


module.exports = profileRouter;
