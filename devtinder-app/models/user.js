const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      validate: {
        validator: function (v) {
          return v >= 18 && v <= 100;
        },
        message: (props) =>
          `${props.value} is not a valid age! Age must be between 18 and 100.`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate: {
        validator: (v) => {
          ["male", "female", "other"].includes(v.toLowerCase());
        },
        message: (props) => `${props.value} Gender is not valid`,
      },
    },
    skills: {
      type: [String],
    },
    country: {
      type: String,
      default: "India",
      // default: () => "India"
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Mongoose will also automatically pluralized the model name from "User" to "users" for the collection name.
// If you want to specify a custom collection name, you can pass it as the second argument to mongoose.model.
// const User = mongoose.model("User", userSchema, "customCollectionName");
const User = mongoose.model("User", userSchema);

module.exports = User;
