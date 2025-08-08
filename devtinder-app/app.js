const express = require("express");

const app = express();



app.get("/user", (req, res) => {
  res.send({
    name: "Ranjan",
  });
});

app.get("/ab*c", (req, res) => {
  res.send("Hello from abc");
});

app.post("/user", (req, res) => {
  // Save user to database
  // For now, we will just send a success message
  res.send("User created successfully");
});

app.delete("/user", (req, res) => {
  // Delete user from database
  res.send("User deleted successfully");
});

app.listen(3000, () => {
  console.log("Application is running on 3000");
});
