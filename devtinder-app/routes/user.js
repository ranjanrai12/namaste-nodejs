// Dependencies
const express = require("express");

// Routers
const userRouter = express.Router();

// Models
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

// Middlewares
const { userAuth } = require("../middlewares/auth");

// Constants
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

/**
 * @route GET /user/request/received
 * @description Get all received connection requests
 */
userRouter.get("/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName country");

    if (!connectionRequests.length) {
      return res.status(400).json({ message: "No connection request found" });
    }

    res.status(200).json({ data: connectionRequests });
  } catch (err) {
    res.status(500).send("Error fetching user: " + err.message);
  }
});
/**
 * @route GET /user/connections
 * @description Get all connections
 */
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // accepted connection wither from my end or from their end and should in accepted state
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    // Transform data: return only the other user, not the whole request

    const connections = connectionRequests.map((request) => {
      // If the request is from the current user, return the other user
      if (request.fromUserId.toString() === request.toUserId.toString()) {
        return request.toUserId;
      }
      // Otherwise, return the sender
      return request.fromUserId;
    });
    res.json({ data: connections });
  } catch (err) {
    res.status(500).send("Error fetching connections: " + err.message);
  }
});
/**
 * @route GET /user/feed
 * @description Get all users
 */
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;

    if (limit > 50) limit = 50;
    // calculate skip
    const skip = (page - 1) * limit;

    // also this user should not have taken actions before like accepted or rejected, ignored or interested
    /**
     * $or: [
     *   { fromUserId: loggedInUser._id },
     *   { toUserId: loggedInUser._id }
     * ]
     * This query checks for a connection request where either:
     * - The current user (fromUserId) has sent a request to another user (toUserId)
     * - The current user (toUserId) has sent a request to another user (fromUserId)
     * If either condition is true, it means there is already a connection request between these two users.
     */
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    /**
     * Hide user from feed
     */
    const hideUserFromFeed = new Set();
    for (let request of connectionRequest) {
      hideUserFromFeed.add(request.toUserId.toString());
      hideUserFromFeed.add(request.fromUserId.toString());
    }
    /**
     * Get all users
     * $and: [
     *   { _id: { $nin: Array.from(hideUserFromFeed) } },
     *   { _id: { $ne: loggedInUser._id } }
     * ]
     * This query checks for users that are not in the hideUserFromFeed set and are not the current user (loggedInUser._id).
     */
    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUserFromFeed) },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(500).send("Error fetching feed: " + err.message);
  }
});

module.exports = userRouter;
