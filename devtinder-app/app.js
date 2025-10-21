require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongooseDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");


// Middlewares
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/auth", authRouter);

app.use("/profile", profileRouter);

app.use("/request", requestRouter);

app.use("/user", userRouter);

mongooseDB()
  .then((res) => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Application is running on 3000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
