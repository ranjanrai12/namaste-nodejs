# Episode-11 | Diving into the APIs and express Router

## Tinder-like App API Documentation

**Overview**

This documentation outlines the API architecture for a Tinder-like application, focusing on:

- **API categorization** using Express Router

- **Endpoint planning** based on Tinder's actual API structure

- **Best practices** for scalable backend development

## API Categories & Endpoints

Please check `apiList.md`

## Project structure

src/
├── app.js # Main application entry
├── routes/ # All route handlers
│ ├── auth.js # Authentication routes
│ ├── profile.js # Profile management routes  
│ └── request.js # Connection request routes
├── models/ # MongoDB models
│ └── User.js  
└── utils/ # Helper functions
└── validation.js

## 2. Router Implementation

```js
const express = require("express");
const app = express();

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

// Middlewares
app.use(express.json());

// Mount routers
app.use("/auth", authRouter); // Routes start with /auth
app.use("/profile", profileRouter); // Routes start with /profile
app.use("/request", requestRouter); // Routes start with /request

// Example: GET /profile -> handled by profileRouter
// Example: POST /auth/signup -> handled by authRouter

module.exports = app;
```

**key points**:

`app.use("/path", router)` → mounts a router at a path prefix.

- **Example**: app.use("/auth", authRouter) means routes in authRouter are accessible as /auth/signup, /auth/login, etc.

```js
// Profile Edit API
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

// Profile Forgot Password API
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
```