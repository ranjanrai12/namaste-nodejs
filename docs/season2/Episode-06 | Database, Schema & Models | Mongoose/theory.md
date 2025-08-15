# Episode-06 | Database, Schema & Models | Mongoose

## Connecting Application to MongoDB

### Prerequisites

- Create a `free` MongoDB cluster.
- Install `Mongoose` library in the application.
- Install `dotenv`.

```bash
npm install mongoose

npm install dotenv
```

### Steps to Connect

**Create Database Configuration**

- Create a `config` folder in `src` directory.
- Add a `database.js` file inside it.
- Create a `.env` file at root level and make declare in `.gitignore`.
- `.env` file will contain mongoDB connection url.

```js
// config/database.js
const mongoose = require("mongoose");

const connectMongooseDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};

module.exports = connectMongooseDB;
```

### Modify app.js

```js
// app.js
require("dotenv").config();
const mongooseDB = require("./config/database");

mongooseDB()
  .then((res) => {
    console.log("Database connected successfully", res);
    app.listen(3000, () => {
      console.log("Application is running on 3000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
```

## Important Notes

### Connection String

- Get connection string from MongoDB Atlas dashboard.
- Format: `mongodb+srv://<username>:<password>@cluster-name.mongodb.net/devTinder`
- The `/devTinder` at the end specifies the database name.

### Best Practices

- Always connect to database before starting your server.
- Store sensitive information (username/password) in environment variables.

## Database Schema Guide

### Creating User Schema in MongoDB

#### Understanding Schemas and Models

- **Schema**: Defines the structure of documents in a MongoDB collection.
  - Specifies what `fields` a document can have.
  - Defines the data type for each field.
  - Acts as a blueprint for data.
- **Model**:
  - A compiled version of the schema.
  - Provides an interface to interact with the database collection.
  - Allows creating, reading, updating, and deleting documents.

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User Schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
});

// Create User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
```

**Field Definitions:**

- Each field has a type (String, Number, etc.).
- Can add validation like `required: true`.
- Can make fields unique (`unique: true`).
- Can restrict values (`enum` for gender).

**Naming Conventions:**

- Use camelCase for field names (firstName, not first_name)
- Model names are capitalized (User).
- Collection name will be lowercase plural in MongoDB (users)

**Schema Best Practices:**

- Define all possible fields upfront.
- Include validation where appropriate.
- Keep schemas in separate files for each model.
- Export the model for use in other files.

[For More Details Refer mongoose documentation](https://mongoosejs.com/docs/guide.html)

### Create Signup Endpoint

```js
require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongooseDB = require("./config/database");
const User = require("./models/user");
const app = express();

// Signup API
app.post("/signup", async (req, res) => {
  console.log("Request received to create user");
  const user = new User({
    name: "Ranjan",
    age: 30,
    lastName: "Rai",
    email: "ranjan@gmail.com",
  });
  try {
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});
```

**Important Notes**

- **Automatic Fields:**

  - `_id`: Unique identifier (MongoDB ObjectID) - never modify manually
  - `__v`: Version key - The purpose of the `__v` field is to track the version of a document which prevents conflicts when multiple users try to update the same document at the same time.

  **Example**:

  ```js
    // Fetch the same user from DB in two different processes
    // DB: { name: "Ranjan", age: 25, __v: 0 }
    Process A: Changes name to "Ranjan Rai"
    Process B: Changes age to 26

    Process A saves → DB: { name: "Ranjan Rai", age: 25, __v: 1 }
    Process B tries to save with old __v: 0 → ❌ VersionError
  ```

- **Best Practices:**
  - Always wrap database operations in `try-catch` blocks.
  - Never manually set `_id` values - let MongoDB handle it.
  - Use proper status codes in responses.
