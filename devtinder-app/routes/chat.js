const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/:toUserId", userAuth, async (req, res) => {
  const toUserId = req.params.toUserId;
  const fromUserId = req.user._id;

  let chat = await Chat.findOne({
    participants: { $all: [fromUserId, toUserId] },
  }).populate({
    path: "messages.senderId",
    select: "firstName lastName message",
  });
  if (!chat) {
    chat = new Chat({
      participants: [fromUserId, toUserId],
      messages: [],
    });
    await chat.save();
  }
  res.json(chat);
});

module.exports = chatRouter;
