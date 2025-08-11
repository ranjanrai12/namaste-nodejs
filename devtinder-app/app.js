require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongooseDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

app.post("/signup", async (req, res) => {

    const user = new User(req.body);
  try {
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

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
