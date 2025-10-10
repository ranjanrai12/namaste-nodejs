# Episode-12 | Logical DB Query & Compound Indexes

## Overview

Implementation of the **Connection Request** feature, a core functionality of the Dev-Tinder-like application. It allows users to express interest (**interested**) or disinterest (**ignored**) in other profiles, mimicking the **swipe right** and **swipe left** actions.

## Database Schema: ConnectionRequest

A new collection is created to manage the relationships between users. Storing this data directly in the **User** collection is considered bad practice as it would complicate the user document with unrelated state management for requests.

```js
const connectionRequestSchema = new mongoose.Schema(
  {
    // // Reference to the user who SENT the request
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Reference to the user who RECEIVED the request
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // State of the connection request
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "interested", "ignored"],
        message: "${VALUE} is not correct status type",
      },
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create a Compound Index for efficient querying
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Middleware (Pre-save Hook): Prevent users from sending requests to themselves
connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send a connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequestModel;
```

### Key Schema Explanations:

- `fromUserId` & `toUserId`: Use the ObjectId type to store references to documents in the `User` collection. The `ref` option is a mongoose feature that helps with populating these fields later if needed.

- `status`: Uses an `enum` validator to ensure only the specified values can be stored. This is a schema-level validation.

- `timestamps`: Adds `createdAt` and `updatedAt` fields automatically, useful for showing "5 minutes ago" messages.

- **Pre-save Hook**: A middleware function that runs before a document is saved. It checks if a user is trying to send a request to themselves and throws an error if true.

- **Compound Index**: An index on both fromUserId and toUserId together. This dramatically speeds up queries that search for a specific pair of users (e.g., "Has Akshay already sent a request to Elon?"), which is critical for performance as the number of requests grows.

## API Endpoint: Send Connection Request

**API Path**: POST /request/send/:status/:toUserId

This dynamic path allows the same API to handle both "swipe left" (ignored) and "swipe right" (interested) actions.

### Logic Flow:

The API handler performs multiple layers of validation before creating a new request.

- **Middleware**: The `userAuth` middleware runs first. It verifies the JWT token and attaches the logged-in user's document to req.user .

- **Validate Status**: Check if the status from the URL params is either 'ignored' or 'interested'. The accepted and rejected statuses are reserved for other actions (e.g., accepting a received request).

- **Validate Target User**: Check if the toUserId from the URL params corresponds to a real user in the database.

- **Check for Existing Request**: Check if any request already exists between these two users in any direction (A->B or B->A). This prevents duplicate requests and deadlock situations.

- **Create & Save**: If all checks pass, create a new ConnectionRequest document and save it to the database.

```js
const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async () => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    // 1. Validate Status
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type",
        status: status,
      });
    }
    // 2. Validate Target User Exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // 3. Check for Existing Request (in any direction)
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId }, // Check if A->B exists
        { fromUserId: toUserId, toUserId: fromUserId }, // Check if B->A exists
      ],
    });
    if (existingRequest) {
      res.status(400).json({ message: "Connection request already exists" });
    }
    // 4. Create and Save the New Request
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();

    // 5. Success Response
    res.json({
      message: "Connection request sent successfully",
      data: data,
    });
  } catch (err) {
    // Handle errors from the pre-save hook or database
    res.status(400).json({ message: error.message });
  }
});
module.exports = requestRouter;
```

### Corner Cases Handled:

- **Invalid Status**: Sending a status like 'accepted' or 'xyz' via the API is blocked.

- **Non-existent User**: Sending a request to a fake/user ID not in the DB is blocked.

- **Duplicate Request**: A user cannot send multiple requests to the same person.

- **Bidirectional Request**: User A cannot send a request to User B if User B has already sent one to User A (and vice-versa). This creates a "match" scenario (to be handled later).

- **Self-Request**: The pre-save hook prevents a user from sending a request to themselves.

## Database Indexing

**What**: An index is a special data structure that helps the database find documents much faster, much like an index in a book.

**Why**: Without indexes, every query requires a "collection scan" – the database must look at every single document. This becomes very slow as the collection grows (e.g., 1,000,000+ requests)

**How in Mongoose**: Define indexes in your schema using the `index` option on a field or the `schema.index()` method.

**Compound Index**: An index on multiple fields (e.g., `{ fromUserId: 1, toUserId: 1 }`) optimizes queries that filter by both those fields together.

**Unique Index**: A constraint that automatically creates an index and ensures no two documents have the same value for that field (e.g., `email: { type: String, unique: true }`).

## Middleware (Pre-save Hooks)

- **What**: Functions that are executed before or after a specific event (e.g., `save`, `validate`).

- **Use Case**: Perfect for data validation and manipulation that should happen automatically whenever a document is saved (e.g., hashing passwords, validating data relationships).

- **Note**: Use regular `function()` instead of `arrow` functions to access the document via this.

# MongoDB Logical Query Operators

## Overview

Logical query allow to combine multiple filter condition to create more complex and powerful query. They are essential for finding documents that matches specific, often non-specific criteria.

## The `$or` Operator

The `$or` operator performs a logical **OR** operation on an array of conditions. It selects documents that satisfy **at least one** of the specified conditions.

```js
{ $or: [ { <condition1> }, { <condition2> }, ... , { <conditionN> } ] }
```

**use case:** Finding documents where either condition A is true or condition B is true.

## The $and Operator

The `$and` operator performs a logical **AND** operation on an array of conditions. It selects documents that satisfy **ALL** of the specified conditions.

**Important Note:**

MongoDB provides an **implicit** `and` for conditions in the same object. Using the **explicit** `$and` is necessary **only** when need to use same field multiple times with different conditions, or when using multiple `$or` expressions.

**Example 1: Implicit AND (Most Common)**

**Goal:** Find users named "Akshay" who are also 30 years old. The two conditions are implicitly joined with an AND.

```js
const users = await User.find({ firstName: "Akshay", age: 30 });
```

**Example 2: Explicit $and (Necessary Use Case)**

**Goal:** Find users where the age field is greater than 25 **AND** less than 40. We must use `$and` because the same field is used twice.

```js
const users = await User.find({
  $and: [{ age: { $gt: 25 } }, { age: { $lt: 40 } }],
});
// This can also be written more cleanly with a single object:
// { age: { $gt: 25, $lt: 40 } }
```

**Example 3: Combining Multiple $or Clauses**

**Goal:** Find users who are EITHER named "Akshay" OR "Virat" AND who are EITHER 30 OR 35 years old.

```js
const users = await User.find({
  $and: [
    { $or: [{ firstName: "Akshay" }, { firstName: "Virat" }] },
    { $or: [{ age: 30 }, { age: 35 }] },
  ],
});
```

**Explanation:** This query finds users that match a name (**Akshay OR Virat**) and also match an age (**30 OR 35**). Without the $and, the $or clauses would be merged incorrectly.

## The $nor Operator

The `$nor` operator performs a logical **NOR** operation on an array of conditions. It selects documents that fail **ALL** of the specified conditions. It's the inverse of `$or`.

```js
{ $nor: [ { <condition1> }, { <condition2> }, ... , { <conditionN> } ] }
```

**Use Case:**
Finding documents that are none of the given criteria. Useful for exclusion.

**Goal:** Find all users who are NOT named "Akshay" and are NOT 30 years old.

```js
const users = await User.find({
  $nor: [{ firstName: "Akshay" }, { age: 30 }],
});
```

## The $not Operator

The `$not` operator performs a logical **NOT** operation on a **single** condition. It selects documents that do **not** match the given expression.

```js
{ field: { $not: { <operator-expression> } } }
```

**Use Case:**

Negating a single, often complex, condition.

**Example 1: Negating an Operator**

**Goal:** Find all users where the age is not greater than 30 (i.e., age is <= 30).

```js
const users = await User.find({ age: { $not: { $gt: 30 } } });
```

**Example 2: Negating a Regex Pattern (Very Useful)**

**Goal:** Find all users whose email does NOT end with @gmail.com.

```js
const users = await User.find({
  email: {
    $not: /@gmail.com$/i, // 'i' flag for case-insensitive
  },
});
```

## Compound Index

Compound indexes collect and sort data from multiple field values from each document in a collection. 

// TODO: Need to Explore more....
