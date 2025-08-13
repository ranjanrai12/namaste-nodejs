# Episode - 1 | Microservice vs Monolith - How to build a project

## Introduction

This guide explains how software projects are built in industry, covering:

- Software Development Life Cycle (SDLC)
- Team roles and responsibilities
- Monolithic vs Microservices architecture

## 1. Software Development Life Cycle (Waterfall Model)

### Phases:

| Phase                        | Activities                                | Responsible Team               |
| ---------------------------- | ----------------------------------------- | ------------------------------ |
| **Requirement Gathering**    | Define features, user flows, UI mockups   | Product Manager + Designers    |
| **Design**                   | System architecture, tech stack decisions | Senior Engineers/Tech Leads    |
| **Development**              | Writing code, implementation              | Developers (SD1, SD2, Interns) |
| **Testing**                  | Unit tests, integration tests             | Developers + QA Team           |
| **Deployment & Maintenance** | Production release, updates               | DevOps + Developers            |

### Key Insights:

- **Product Managers (PMs)** define what to build (not developers!).
- **Designers** create UI mockups before coding starts.
- **Developers** write code + unit tests (testing is part of development!).
- **Deployment** is handled by DevOps or senior developers.

## 2. Architecture: Monolithic vs Microservices

### Monolithic Architecture

**Single, large codebase** containing:

- Backend
- Frontend
- Database
- All business logic

**Pros:**

- Simpler initial development
- Easier debugging
- Good for small teams

**Cons:**

- Hard to scale
- Slower deployments
- Difficult for large teams

### Microservices Architecture

**Multiple independent services**, each handling one function:
**Pros:**

- Highly scalable
- Independent deployments
- Fault isolation

**Cons:**

- Complex to manage
- Debugging challenges
- Needs DevOps expertise

## 3. DevTinder Implementation Approach

**Tech Stack:**

- Backend: Node.js + Express
- Database: MongoDB
- Frontend: React (minimal focus)
- Deployment: CI/CD pipelines

**Why Microservices?**

- Better reflects industry practices
- Easier to add features later
- Good learning experience

# Microservices vs Monolithic Architecture: Industry Insights

## Overview

This guide compares monolithic and microservices architectures based on real-world industry experience, particularly for junior engineers and students transitioning to professional development.

![alt text](/assets/season2/image1.png)

## Key Comparison Table

| Factor              | Monolithic Architecture                   | Microservices Architecture            |
| ------------------- | ----------------------------------------- | ------------------------------------- |
| **Dev Speed**       | Slower (single codebase, many developers) | Faster (parallel development)         |
| **Code Repo**       | Single large repository                   | Multiple independent repositories     |
| **Scalability**     | Challenging at large scale                | Easier (scale services independently) |
| **Deployment**      | Whole app redeployed for any change       | Independent service deployments       |
| **Tech Stack**      | Restricted to one stack                   | Freedom to choose per service         |
| **Infra Cost**      | Lower                                     | Slightly higher                       |
| **Complexity**      | High for large projects                   | Easier to manage at scale             |
| **Fault Isolation** | Whole app can crash                       | Only affected service fails           |
| **Testing**         | Easier end-to-end testing                 | Harder distributed testing            |
| **Ownership**       | Centralized                               | Distributed by team                   |
| **Maintenance**     | Harder                                    | Easier per service                    |
| **Debugging**       | Slightly easier                           | Can be challenging                    |

## Detailed Insights

### Development Experience

- **Microservices win** for development speed and parallel work
- Example: Frontend and backend teams can work independently
- In monoliths, code reviews and merges become bottlenecks

### Scaling Challenges

- **Monoliths become unwieldy** as codebase grows (Uber's early challenges)
- **Microservices allow** targeted scaling (e.g., just scale analytics service)

### Deployment Differences

- **Monolith pain point**: Must redeploy entire app for small changes
- **Microservices advantage**: Deploy just the changed service
- **Versioning challenge**: Requires good coordination between teams

### Real-World Example: Namaste Dev

Current microservices:

1. **Student Web** (Next.js)
2. **Admin Dashboard** (React)
3. **Backend Service** (Node.js)
4. **Mobile App** (React Native - planned)

## DevTinder Implementation Approach

### Architecture Choice

We'll build Devinder with **2 microservices**:

1. **Frontend Service**: React application
2. **Backend Service**: Node.js application

### Communication

- Frontend and backend will communicate via **REST APIs**
- Example flow:

Frontend (devTinder.com/profile) → API Call → Backend (/get-profile) → Database → Response → UI

## Key Takeaways for Junior Engineers

1. **Industry Trend**: Most companies are moving to microservices
2. **Start Simple**: Begin with few services, expand as needed
3. **Team Structure**: Microservices enable focused team ownership
4. **Practical Tip**: Maintain API compatibility between services

## Action Items

1. **For Students**:

- Try building both architectures in small projects
- Research how major companies transitioned (e.g., Netflix, Uber)

2. **For DevTinder**:

- We'll start with clean separation between frontend/backend
- Focus on Node.js backend implementation
- Build industry-standard communication patterns

> "Microservices give you flexibility but require discipline in coordination." - Industry Insight

# Episode - 2 | Episode-02 | Features, HLD, LLD & Planning

# Introduction

DevTinder is a Tinder-like platform designed specifically for developers to connect with each other. It allows users to create profiles, explore other developers, send connection requests, and manage their matches.

# Features List

Here are the core features we will implement in DevTinder:
User Authentication

### 1: Sign Up (Create Account)

- Sign Up (Create Account)
- Login

### 2: Profile Management

- Create/Update Profile (Name, Email, Age, Gender, Interests, Photos)

### 3: Explore & Connections

- **Explore Feed** – View other developers’ profiles.
- **Send Connection Request** (Like/Swipe Right).
- **Ignore Profile** (Dislike/Swipe Left)

### 4: Request Management

- **View Received Requests** (Pending)
- **Accept/Reject Requests**
- **View Sent Requests** (Status: Pending/Accepted/Rejected/Ignored)

### 5: Matches & Connections

- **View All Matches** (Mutual Connections)

## Technical Planning

### Tech Stack

- **Backend:** Node.js (Express.js)
- **Database:** MongoDB (NoSQL)
- **Frontend:** React
- **Authentication:** JWT (JSON Web Tokens)

## Microservices

We will structure the backend into two main parts:

- **User Service** – Handles authentication & profile management.

- **Connection Service** – Manages connection requests & matches.

## Database Design

We will use MongoDB (NoSQL) with the following collections:

### users Collection

Stores user **profile data.**

**Fields:**

`_id` (Auto-generated by MongoDB)

`firstName` (String)

`lastName`(String)

`email` (String, Unique)

`password` (Hashed String)

`age` (Number)

`gender` (String)

`interests` (Array of Strings)

`photos` (Array of URLs)

### connectionRequests Collection

Stores **connection requests & statuses.**

**Fields:**

- `_id` (Auto-generated)
- `fromUserId` (Ref: users.\_id)
- `status` (Enum: `pending`, `accepted`, `rejected`, `ignored`
- `createdAt` (Timestamp))

## API Design (RESTful APIs)

We will implement the following APIs:

### Authentication APIs

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| `POST` | `/api/auth/signup` | Create new user account  |
| `POST` | `/api/auth/login`  | User login (returns JWT) |

### Profile APIs

| Method  | Endpoint       | Description            |
| ------- | -------------- | ---------------------- |
| `GET`   | `/api/profile` | Get user profile       |
| `POST`  | `/api/profile` | Create/update profile  |
| `PATCH` | `/api/profile` | Partial profile update |

### Connection APIs

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| `POST` | `/api/connections/send`     | Send connection request |
| `POST` | `/api/connections/respond`  | Accept/reject request   |
| `GET`  | `/api/connections/received` | Get pending requests    |
| `GET`  | `/api/connections/sent`     | Get sent requests       |
| `GET`  | `/api/connections/matches`  | Get accepted matches    |

# Episode-03 | Creating our Express Server

## Setting Up the Project from Scratch

### Initializing the Project

- Create a new folder for the project:
- Initialize a Node.js project using npm:

```bash
npm init
```

- Fill in details (name, version, description, etc.) or press Enter to accept defaults.
- This generates a `package.json` file containing project metadata.

### Project Structure

- Create an src folder (source code directory):
- Inside `src`, create `app.js` (entry point of the application):
- Add a simple `console.log` to test:

```js
console.log("Starting a new project!");
```

- Run the file:

```bash
node src/app.js
```

### Installing Express.js

- Install Express (a Node.js framework for building servers):

```bash
npm install express
```

- This creates `node_modules` (stores all dependencies).
- Updates `package.json` with `express` as a dependency.

### Understanding Dependencies

- `node_modules:` Contains all installed packages (including transitive dependencies).
- `package-lock.json:` Locks exact dependency versions (ensures consistency).
- **Semantic Versioning (^ and ~)**:
  - `^4.19.0` → Allows minor & patch updates (e.g., `4.20.0`).
  - `~4.19.0` → Allows only patch updates (e.g., `4.19.1`).
  - No symbol → Strictly uses the exact version.

### Creating a Basic Express Server

```js
// app.js File
const express = require("express");
const app = express();

// Basic route handler
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/test", (req, res) => {
  res.send("Hello from /test!");
});

app.get("/hello", (req, res) => {
  res.send("Hello Hello Hello!");
});

// Start server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Using Nodemon for Auto-Restart

- Install Nodemon globally (auto-refreshes server on file changes):

```bash
npm install -g nodemon
```

- Run the server with Nodemon:

```bash
nodemon src/app.js
```

- Now, any changes to app.js will automatically restart the server.

# Episode-04 | Routing and Request Handlers

## Understanding Routes in Express

### Route Matching is Sequential

- Checks routes top-to-bottom.
- **Wildcard** `app.use('/')` catches all routes if placed first.

### Route Paths

- `/hello` → Matches `/hello` only.
- `/hello/` → Matches `/hello/*` (any subpath).

### Order Matters!

```js
// Wrong (wildcard first → blocks other routes)
app.use("/", (req, res) => res.send("Wildcard!"));
app.get("/hello", (req, res) => res.send("Hello!")); // Never reached

// Correct (specific routes first)
app.get("/hello", (req, res) => res.send("Hello!"));
app.use("/", (req, res) => res.send("Wildcard!"));
```

### Setting Up Postman

- **Step 1: Install Postman**
  - Download from `postman.com.`
  - Install the desktop app (Windows/macOS/Linux).
- **Step 2: Create a Workspace**
  - Open Postman → Click **Workspaces** → **Create Workspace**.
  - Name it (e.g., `DevTinder`).
  - Set visibility (Personal/Team) as per choice.
- **Step 3: Create a Collection**
  - Inside the workspace → Click **Collections** → **Create Collection**
  - Name it (e.g., `DevTinder APIs`).
- **Step 4: Test your API Request**

  - Click **New** → **HTTP Request**.
  - Enter your api URL with proper method call(GET, POST, etc...)
  - Click **Send**
  - Save the **request** in the collection.

### Method-Specific Handling

```js
// GET /user → Returns user data
app.get("/user", (req, res) => {
  res.send({ name: "Ranjan" });
});

// POST /user → Saves data
app.post("/user", (req, res) => {
  console.log("Saving to DB...");
  res.send("Data saved!");
});
// ... and so on for delete and put and more.
```

### Advanced Routing Techniques

**Route Patterns**

| Pattern  | Meaning                        | Example Matches        |
| -------- | ------------------------------ | ---------------------- |
| `ab?c`   | `b` is optional                | `/ac`, `/abc`          |
| `ab+c`   | 1+ `b` characters              | `/abc`, `/abbc`        |
| `ab*cd`  | Anything between `ab` and `cd` | `/abXYZcd`, `/ab123cd` |
| `a(bc)?` | `bc` group is optional         | `/a`, `/abc`           |

- **Usage Notes:**

  - `?` makes the preceding character/group optional
  - `+` requires one or more of the preceding character
  - `*` matches any characters (including none)
  - Parentheses () create capture groups

    **Notes**:

    - `{b}` from `express V5` **?** no longer supported.
    - `+` Is not supported any more.

    Breaking Changes From `V5`: https://expressjs.com/en/guide/migrating-5.html#path-syntax

**Regular Expressions**

```js
// Matches paths containing 'a'
app.get(/a/, (req, res) => res.send("Contains 'a'"));

// Matches paths ending with 'fly'
app.get(/.*fly$/, (req, res) => res.send("Ends with 'fly'"));
```

**Dynamic Routes & Parameters**

```js
// URL: /user/101
app.get("/user/:id", (req, res) => {
  console.log(req.params.id); // → "101"
});

// URL: /user/101/name/Akshay
app.get("/user/:id/name/:name", (req, res) => {
  console.log(req.params); // → { id: "101", name: "Akshay" }
});
```

**Query Parameters**

```js
// URL: /search?q=nodejs
app.get("/search", (req, res) => {
  console.log(req.query.q); // → "nodejs"
});
```

# Episode-05 | Middlewares & Error Handlers

## Route Handlers

- Functions that process HTTP requests and send responses.
- Signature: `(req, res, next) => { ... }`

- **Key Points:**
  - Must call `res.send()` to complete the request.
  - Without `res.send()`, the request hangs indefinitely.
  - Can have multiple handlers per route

### Multiple Handlers

```js
// 1: Example 1
app.get(
  "/user",
  (req, res, next) => {
    console.log("This is the first middleware function");
    res.send({
      name: "Ranjan",
    });
    console.log("This will be executed after the response is sent");
    next();
  },
  (req, res) => {
    console.log("This is the second middleware function");
    /** Here it will give and Error because server already responded to the client in the 1st handler

     res.send({
      age: 30,
     });
    **/
  }
);
// Example 2
app.get(
  "/user",
  (req, res, next) => {
    console.log("This is the first middleware function");
    res.send({
      name: "Ranjan",
    });
    next();
    console.log("This will be executed after the response is sent");
  },
  (req, res) => {
    console.log("This is the second middleware function");
  }
);
// Output
/**
 * This is the first middleware function
 * This is the second middleware function
 * This will be executed after the response is sent
 */

// Example 3:
app.get(
  "/user",
  (req, res, next) => {
    console.log("This is the first middleware function");
    res.send({
      name: "Ranjan",
    });
    next();
    console.log("This will be executed after the response is sent");
  },
  (req, res) => {
    res.send({
      age: 30,
    });
    console.log("This is the second middleware function");
  }
);
// Output
/**
 * This is the first middleware function
 * Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client at ServerResponse.setHeader ..
**/
**`Notes`**: It throws an Error because server already responded to the client in the 1st handler

// Example 4:
app.get(
  "/user",
  (req, res, next) => {
    console.log("This is the first middleware function");
    console.log("This will be executed after the response is sent");
    next();
  },
  (req, res, next) => {
    console.log("This is the second middleware function");
    next();
  },
  (req, res, next) => {
    console.log("This is the third middleware function");
    next();
  }
);
/**
 **In the terminal we will get output below**
 *  This is the first middleware function
 * This will be executed after the response is sent
 * This is the second middleware function
 * This is the third middleware function

**In Server response**
* We will get in response 404 not found
* <pre>Cannot GET /user</pre>
* The reason when we write next() then next handler must be present else we will get 404 not found.
**/
```

### Multiple Route Handlers Syntax

- **Basic Syntax**: chaining multiple handlers for a single route

```js
app.METHOD(path, handler1, handler2, ..., handlerN)
```

- **Array Syntax**: Handlers can be passed as an array

```js
app.METHOD(path, [handler1, handler2, ..., handlerN])
```

- **Mixed Syntax**: Combine standalone handlers and arrays

```js
app.METHOD(path, handler1, [handler2, handler3], handler4);
```

### Critical Rules

- **Response**
  - Once `res.send()` is called, the chain ends.
  - Any subsequent `res` methods will throw `errors`.
- **next() Behavior:**
  - Must be called to continue to `next` handler
  - If no more handlers exist after next(), Express returns "Cannot GET [path]"

## Middleware

- Functions that execute between request and response.
- Same signature as route handlers but typically used for:
  - Authentication
  - Logging
  - Data parsing
  - Error handling

### Middleware Implementation

**Authentication Middleware**

```js
// Folder -> Middlewares/auth
// Custom authentication middleware
const authMiddleware = (req, res, next) => {
  const token = "ABC";
  if (token !== "ABC") {
    return res.status(401).send("Unauthorized");
  }
  next(); // Pass to next middleware/handler
};

const userMiddleware = (req, res, next) => {
  const token = "XYZ";
  if (token !== "XYZ") {
    return res.status(401).send("Unauthorized");
  }
  next(); // Pass to next middleware/handler
};

module.exports = { authMiddleware, userMiddleware };

//app.js
const { authMiddleware, userMiddleware } = "./middlewares/auth";
app.use("/admin", authMiddleware);

app.get("/user/getData", userMiddleware, (req, res) => {
  res.send("Data fetched successfully");
});
```

**Error Middleware**

```js
//Example 1:
// Global error handler (LAST middleware)
app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  if (error) {
    res.status(500).send("Server error");
    // This will be never send because there is no error at first place and we have kept the error middleware at first place, So remember order matters.
  }
});

app.get("/data", async (req, res) => {
  try {
    const data = await fetchData();
    res.send(data);
  } catch (err) {
    res.status(500).send("Data fetch failed");
  }
});

//Example 2:
// Route-level error handling
app.get("/data", async (req, res) => {
  try {
    const data = await fetchData();
    res.send(data);
  } catch (err) {
    res.status(500).send("Data fetch failed");
  }
});

// Global error handler (LAST middleware), If in some handler Error is not handle then below global error handler can easily catch it.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});
```

**Note**: In Express, an error-handling middleware is defined like:

```js
app.use((err, req, res, next) => { ... });

```

The first argument (`err`) is special — Express will only call this middleware when there’s an error in the pipeline.

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

**Note:** `[options.returnDocument='before']` Has two possible values, 'before' and 'after'. By default, it will return the document before the update was applied.

**[Study all model methods in Mongoose docs](https://mongoosejs.com/docs/api/model.html)**
