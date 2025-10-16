const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 10,
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
      //   validate: function(val) {
      //     if(!validator.isEmail(val)) {
      //         throw new Error("Invalid email format");
      //     }
      //   }
      validate: {
        validator: function (v) {
          //return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
          if (!validator.isEmail(v)) {
            throw new Error("Invalid email format");
          }
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 6;
        },
        message: (props) => `Password must be at least 6 characters long!`,
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "${VALUE} is not a valid Gender",
      },
      // validate: {
      //   validator: (v) => {
      //     ["male", "female", "other"].includes(v.toLowerCase());
      //   },
      //   message: (props) => `${props.value} Gender is not valid`,
      // },
    },
    skills: {
      type: [String],
    },
    country: {
      type: String,
      default: "India",
      maxlength: 50,
      // default: () => "India"
    },
    about: {
      type: String,
      maxlength: 200,
      validate: {
        validator: function (v) {
          return v.length <= 200;
        },
        message: (props) => `About should not be more than 200 characters`,
      },
    },
    photoUrl: {
      type: String,
      default:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIGCAQHAAAAAAAAAAECAwQFEQZBEiExUWGBEyJCcZGxwdEjMlKhFBUkU2Ky4f/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABs+4FT4s12Vc5YGFPaXZdZF9a/xXd4gSmp8R4GnydblK+5dsKtnt732EPLjSzpergx6PjZ1/IqgLhq9YPF2FfJQyYTxpP2n60fj2r4Fgg1OKlBqUWt04vdMyUmeHdbs025VXScsSb9aL9h96+wGhA8jJSipRacZLdNdjR6QAAAAAAAAAAAAAAAAcmq5awNOvyureEfVT5t9n7mYSk5ycpPpSk923zZeuN5uOjwiuyd0d/JN/MohSgAKgACVYvfBmc8nTpY85bzx3st+3ovs+qLAUjgWbWp3wT6p09flJbfNl3IAAAAAAAAAAAAAAAAIHjStz0TpL2LYt+57r5soRqWpYqzdPvxm1+JBpb8ny/fYy+yEq7JVzXRnCTjJPk1yKPkAFQABKsWfgOtvPybNuqNSj5t/8ZdCB4Nwni6X6aa2nkvp9f6eX1fmTxAAAAAAAAAAAAAAAAAK3xLw9LNnLMwYr07X4lf8Ac8V4/MsgAye6uymx13QlXYupxktmvI+DVsjHpyIdDIphbHunFSON6Fpbe/8ABUfAKzXmlzfZ4lj0Hhq7JshkZ9bqx091XJbSs+yLhjYGHivfHxqqn3xgt/idAHiSSSSSSWyS5HoAQAAAAAAAAAAAAAACK1zW6NJr6L2syZL1Kk/3fcgJDIyKsat25Fka649spPZFdz+MMepuGFRO1r25+rHy5sqmoZ+TqN3pcqxza/LHlH3I5gamr+KdVub6F0KV3V1rdeb3OZ67qze/8wv+KI4FxEvVxLq1b3eX6Rd1kIv6ErhcZNNRzsXdc5Uvr+DKmBg1DB1HE1CHSxLYz2/NHslH3o6zJqrLKbY20zlXZHslF7NF04f4ljlOOLqDjC99ULOyM/B9zCrKACAAAAAAAAAAAI/XNUr0nDdsvWtl1VQ/U/sjOMi+3JundfNzsm95SfM7+IdRepalZOL/AAYPoVJ93f59pGAAAaQAAAAAAABeOE9beZX/AAWVJvIrXqSftx8fFFjMox77Ma+F9L6Nlb6UWafp+XDOw6smvqVkd2u5815MyroAAAAAAAAIvibLeHo2ROD2smlXD3t/bclCq8eWtY+JT+qcpPx26vqBTgAWIAAoAAAAAAAAFw4Fy3KrJw5v8rVkPc+p/T4lPJvg+30euVR5WQlHby3+hFaAACAAAAAAFO49f9Rhrl0J/NAAVUAGoyAAKAAAAAAAAEnwy9tew9v1v/VgCjSAAZUAAH//2Q==",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.comparePassword = function () {
  const user = this;
};

// Mongoose will also automatically pluralized the model name from "User" to "users" for the collection name.
// If you want to specify a custom collection name, you can pass it as the second argument to mongoose.model.
// const User = mongoose.model("User", userSchema, "customCollectionName");
const User = mongoose.model("User", userSchema);

module.exports = User;
