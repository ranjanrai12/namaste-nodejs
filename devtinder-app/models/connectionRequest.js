const mongoose = require("mongoose");
/**
 * Schema for connection requests between users.
 * Each request contains the IDs of the sender and receiver,
 * along with the status of the request.
 * Status can be one of: "accepted", "rejected", "interested", "ignored".
 */
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "interested", "ignored"],
        message: "${VALUE} is not correct status type",
      },
    },
  },
  { timestamps: true }
);
/**
 * This creates a compound index on fromUserId and toUserId
 * 1 means ascending order.
 * This index helps to quickly find connection requests
 * between specific pairs of users, improving query performance.
 */
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
/**
 * Pre-save hook to perform actions before saving a connection request.
 * This can be used for validation, logging, or modifying data.
 */
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequestModel;
