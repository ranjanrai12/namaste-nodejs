const express = require("express");

const app = express();



app.use("/", (error, req, res, next) => {
//   if (error) {
//     console.error("An error occurred:", error);
//     res.status(500).send("Internal Server Error");
//   } else {
//     next();
//   }
res.send("This is a middleware function that handles errors. If an error occurs, it will be logged and a 500 status will be sent.");
});

app.get("/user", (req, res) => {
  // Fetch user from database
  // For now, we will just send a success message

//   try {
    // throw new Error("This is an error");
    res.send("User data fetched successfully");
//   } catch (error) {
//     res.status(500).send("An error occurred while fetching user data");
//   }
});

app.use("/", (error, req, res, next) => {
  if (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
}});

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
