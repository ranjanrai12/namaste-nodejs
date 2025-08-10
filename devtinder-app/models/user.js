const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
  },
});
// Mongoose will also automatically pluralized the model name from "User" to "users" for the collection name.
// If you want to specify a custom collection name, you can pass it as the second argument to mongoose.model.
// const User = mongoose.model("User", userSchema, "customCollectionName");
const User = mongoose.model("User", userSchema);

module.exports = User;
