# Episode-07 | Diving into the APIs

## Dynamic User Signup API

### Middleware Setup

- Add `express.json()` middleware to parse incoming JSON requests.
- Essential for reading request bodies

### Implementation Steps

**Add JSON Middleware `(src/app.js)`:**

```js
const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
```

**Updated Signup API:**

```js
app.post("/signup", async (req, res) => {
  try {
    // Create user from request body
    const user = new User(req.body);

    // Save to database
    await user.save();

    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user");
  }
});
```

### Key Concepts

**Request Body Parsing:**

- `express.json()` middleware converts `JSON` payload to JavaScript object.
- Makes data available at `req.body`.

**Dynamic Data Handling:**

- `req.body` contains the user data sent from client.
- Directly used to create new User instance.

## Comparison: JSON vs JavaScript Object

| **Aspect**        | **JSON**                                                              | **JavaScript Object**                                      |
| ----------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Definition**    | Text-based format for data exchange.                                  | In-memory data structure in JavaScript.                    |
| **Syntax**        | Strict syntax: keys and strings must use double quotes.               | Flexible syntax: keys can be unquoted; methods allowed.    |
| **Data Types**    | Supports limited types: string, number, boolean, null, array, object. | Supports all JavaScript data types, including `undefined`. |
| **Functionality** | No methods or executable code.                                        | Can include methods and execute logic.                     |
| **Purpose**       | Used for transferring data between systems.                           | Used for in-program data manipulation.                     |
| **Conversion**    | Requires parsing to convert to JavaScript Object.                     | Can be directly used in JavaScript programs.               |

## Creating APIs to Fetch User Data

### Get User by Email

- Retrieves a single user matching the provided email.
- Returns `404` if user not found

```js
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
```

**key points**

- Uses `findOne()` which returns a single document.
- Uses `find()` which returns a single document in array.
- Returns 404 for non-existent users.
- Always wrap in try-catch for error handling

### Feed API (Get All Users)

- Retrieves all users from the database
- Returns 404 if user not found

```js
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
```

**key points**

- Uses `find({})` with empty filter to get all documents
- Returns array of user objects.

### Key Differences: find() vs findOne()

| **Aspect**       | **find()**                | **findOne()**           |
| ---------------- | ------------------------- | ----------------------- |
| **Returns**      | Array of documents.       | Single document.        |
| **Empty result** | Empty array.              | null.                   |
| **Performance**  | Slower for many docs.     | Faster for one doc.     |
| **Use case**     | When needing all matches. | When needing one match. |

## Update & Delete APIs

### Delete User API

- Deletes a user by their MongoDB.
- Returns success message or error.

```js
app.delete("/user/delete", async (req, res) => {
  try {
    const userId = req.body.id;
    console.log("User ID to delete:", userId);
    // Using findByIdAndDelete to delete the user by ID
    // const deletedUser = await User.findByIdAndDelete(userId);
    // under the hood, userId is converted to { _id: userId }
    const deletedUser = await User.findOneAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting user by ID:" + err.message);
  }
});
```

**Note:** `findByIdAndDelete(id)` is a shorthand for `findOneAndDelete({ _id: id })`

### Update User API

```js
app.patch("/user/update/:id", async (req, res) => {
  try {
    // Using findByIdAndUpdate to update the user by ID
    // const userId = req.params.id;
    // const updatedUser = await User.findByIdAndUpdate(userId, req.body);

    const userEmail = req.body.email;
    // new option ensures that the updated document is returned
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      req.body,
      { returnDocument: "after" }
    );
    console.log("Updated User:", updatedUser);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Error updating user: " + err.message);
  }
});
```

**Note:** `[options.returnDocument='before']` Has two possible values, `before` and `after`.

- **before** (default): Returns the document before the update.
- **after**: Returns the updated document.

**key points**

- [Study all model methods in Mongoose docs](https://mongoosejs.com/docs/api/model.html)
- Any fields not in the Mongoose Schema will be ignored during update.
