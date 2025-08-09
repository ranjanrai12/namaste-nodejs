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
