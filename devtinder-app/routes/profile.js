const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const fs = require("fs");
const path = require("path");
const { upload } = require("../middlewares/multer");
const crypto = require("crypto");

const { userAuth } = require("../middlewares/auth");
const { validationProfileUpdateData } = require("../utils/validations");
const allowedFields = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "gender",
  "about",
  "skills",
  "email",
];

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user.toObject();
    const updatedUserData = {};
    Object.keys(loggedInUser).forEach((key) => {
      if (allowedFields.includes(key)) {
        updatedUserData[key] = loggedInUser[key];
      }
    });
    res.send(updatedUserData);
  } catch (err) {
    res.status(500).send("Error fetching profile: " + err.message);
  }
});

profileRouter.patch(
  "/edit",
  userAuth,
  upload.single("photoUrl"),
  async (req, res) => {
    try {
      if (!validationProfileUpdateData(req)) {
        throw new Error("Update not allowed");
      }
      const loggedInUser = req.user;

      // Handle uploaded photo
      if (req.file) {
        // Calculate file hash
        const hash = crypto
          .createHash("md5")
          .update(req.file.buffer)
          .digest("hex");
        const ext = path.extname(req.file.originalname);
        const fileName = `photo-${hash}${ext}`;
        const uploadPath = path.join(__dirname, "..", "uploads", fileName);

        // Save file only if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.writeFileSync(uploadPath, req.file.buffer);
        }

        // Delete previous image if exists and not same as new one
        if (
          loggedInUser.photoUrl &&
          loggedInUser.photoUrl !== `/uploads/${fileName}`
        ) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            loggedInUser.photoUrl
          );
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }

        loggedInUser.photoUrl = `/uploads/${fileName}`;
      }

      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          loggedInUser[key] = req.body[key];
        }
      });
      await loggedInUser.save();
      const updatedUserData = {
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        age: loggedInUser.age,
        gender: loggedInUser.gender,
        skills: loggedInUser.skills,
        country: loggedInUser.country,
        photoUrl: loggedInUser.photoUrl,
        about: loggedInUser.about,
      };
      res.json({
        message: `${loggedInUser.firstName} Your profile updated successfully`,
        data: updatedUserData,
      });
    } catch (err) {
      res.status(500).send("Error while updating profile: " + err.message);
    }
  }
);

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
