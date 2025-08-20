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
