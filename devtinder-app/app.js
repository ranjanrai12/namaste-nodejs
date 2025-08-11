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

app.get("/user", async (req, res) => {
  //   try {
  // find will return an array of documents
  //     const user = await User.find({ email: req.body.email });
  //     if (user.length === 0) {
  //       res.status(404).send("User not found");
  //     } else {
  //       res.send(user);
  //     }
  //   } catch (err) {
  //     res.status(500).send("Error fetching users: " + err.message);
  //   }
  try {
    // findOne will return a single document or null
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("Error fetching user: " + err.message);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.send("Error fetching user by ID: " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(allUsers);
    }
  } catch (error) {
    res.status(500).send("Error fetching feed: " + error.message);
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
