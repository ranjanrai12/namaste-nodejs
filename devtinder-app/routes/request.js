const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const sendEmail = require("../utils/sendEmail");

requestRouter.get("/user", async (req, res) => {
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

requestRouter.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.send("Error fetching user by ID: " + err.message);
  }
});

requestRouter.get("/feed", async (req, res) => {
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

requestRouter.delete("/user/delete", async (req, res) => {
  try {
    const userId = req.body.id;
    // Using findByIdAndDelete to delete the user by ID
    // Under the hood, userId is converted to { _id: userId }
    const deletedUser = await User.findOneAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting user by ID:" + err.message);
  }
});

requestRouter.patch("/user/update/:id", async (req, res) => {
  try {
    // Using findByIdAndUpdate to update the user by ID
    const userId = req.params.id;
    const allowUpdateFields = [
      "firstName",
      "lastName",
      "skills",
      "country",
      "gender",
    ];
    const updateFieldsBody = Object.keys(req.body);
    const isValidateUpdate = updateFieldsBody.every((field) =>
      allowUpdateFields.includes(field)
    );
    if (!isValidateUpdate) {
      return res.status(400).send("Invalid updates field");
    }
    if (req.body.skills.length > 30) {
      return res.status(400).send("Skills should not be more than 30");
    }
    // runValidators: true ensures that the update respects the schema validation rules
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      runValidators: true,
    });

    // const userEmail = req.body.email;
    // new option ensures that the updated document is returned
    // const updatedUser = await User.findOneAndUpdate({email: userEmail}, req.body, {returnDocument: "after"});
    // console.log("Updated User:", updatedUser);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Error updating user: " + err.message);
  }
});
/**
 * Send connection request
 * @route POST /request/send/:status/:toUserId
 * @access Private
 * @desc Send connection request
 * @body { status: "ignored" | "interested" }
 */
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { _id: fromUserId } = req.user;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    // allowed only ignored and interested in send request
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status type: " + status });
    }

    // If there is any existing connection request
    /**
     * $or: [
     *   { fromUserId: fromUserId, toUserId: toUserId },
     *   { fromUserId: toUserId, toUserId: fromUserId }
     * ]
     * This query checks for a connection request where either:
     * - The current user (fromUserId) has sent a request to the target user (toUserId)
     * - The target user (toUserId) has sent a request to the current user (fromUserId)
     * If either condition is true, it means there is already a connection request between these two users.
     */
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });
    // Check if toUserId exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection already exists" });
    }
    // Create a new connection request
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    
    // Send email
    const emailRes = await sendEmail.run();

    res.status(200).json({
      status: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
      data,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

/**
 * Review connection request
 * @route POST /request/review/:status/:requestId
 * @access Private
 * @desc Review connection request
 * @body { status: "accepted" | "rejected" }
 */
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    // allowed only accepted and rejected
    const allowedStatus = ["accepted", "rejected"];
    // Check if status is allowed
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status type: " + status });
    }
    /**
     * requestId is The _id of the connection request document
     */
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(400).json({ message: "No connection request found" });
    }
    connectionRequest.status = status;
    const updatedConnectionRequest = await connectionRequest.save();
    res.status(200).json({
      message: "Review done successfully",
      data: updatedConnectionRequest,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
