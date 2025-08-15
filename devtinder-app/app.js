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

app.delete("/user/delete", async (req, res) => {
  try {
    const userId = req.body.id;
    console.log("User ID to delete:", userId);
    // Using findByIdAndDelete to delete the user by ID
    // Under the hood, userId is converted to { _id: userId }
    const deletedUser = await User.findOneAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting user by ID:" + err.message);
  }
});

app.patch("/user/update/:id", async (req, res) => {
  try {
    // Using findByIdAndUpdate to update the user by ID
    const userId = req.params.id;
    const allowUpdateFields = ["firstName", "lastName", "skills", "country", "gender"];
    const updateFieldsBody = Object.keys(req.body);
    const isValidateUpdate = updateFieldsBody.every((field) => allowUpdateFields.includes(field));
    if(!isValidateUpdate) {
        return res.status(400).send("Invalid updates field")
    }
    if(req.body.skills.length > 30) {
        return res.status(400).send("Skills should not be more than 30")
    }
    // runValidators: true ensures that the update respects the schema validation rules
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      runValidators: true,
    });

    // const userEmail = req.body.email;
    // new option ensures that the updated document is returned
    // const updatedUser = await User.findOneAndUpdate({email: userEmail}, req.body, {returnDocument: "after"});
    // console.log("Updated User:", updatedUser);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Error updating user: " + err.message);
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
