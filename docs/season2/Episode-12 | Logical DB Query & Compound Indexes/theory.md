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
