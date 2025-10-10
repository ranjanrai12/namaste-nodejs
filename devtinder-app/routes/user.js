const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");
const { connect } = require("mongoose");

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
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

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

module.exports = userRouter;
