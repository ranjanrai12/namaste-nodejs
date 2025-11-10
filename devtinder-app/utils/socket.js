const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Generate secure room ID
const createSecureRoomId = (userId1, userId2) => {
  const sortIds = [userId1, userId2].sort();
  const roomString = sortIds.join("_");
  // Created secure unguessable roomId
  return crypto.createHash("sha256").update(roomString).digest("hex");
};

const initializeSocket = (server) => {
  let onlineUsers = new Set();

  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const loggedInUserId = socket.handshake.auth.userId;

    onlineUsers.add(loggedInUserId);

    // Emit online users to all connected clients
    io.emit("onlineUsers", Array.from(onlineUsers));

    // Handle events
    socket.on("joinChat", ({ firstName, fromUserId, toUserId }) => {
      // const roomId = [fromUserId, toUserId].sort().join("_");
      // Create Room  ID in more secure way
      const roomId = createSecureRoomId(fromUserId, toUserId);

      console.log(firstName + " joining the room", roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, message, fromUserId, toUserId }) => {
        const roomId = createSecureRoomId(fromUserId, toUserId);

        try {
          // Check if both users are friends before allowing to send
          const areFriends = await ConnectionRequest.findOne({
            status: "accepted",
            $or: [
              { fromUserId, toUserId },
              { fromUserId: toUserId, toUserId: fromUserId },
            ],
          });
          if (!areFriends) {
            console.warn(
              `Unauthorized chat attempt between ${fromUserId} and ${toUserId}`
            );
            return socket.emit("unauthorized", {
              message: "Not friends. Cannot send messages.",
            });
          }

          // Fetch existing chat or create if not found
          let chat = await Chat.findOne({
            participants: { $all: [fromUserId, toUserId] },
          });

          // create if doesn't exists
          if (!chat) {
            chat = new Chat({
              participants: [fromUserId, toUserId],
              message: [],
            });
          }
          chat.messages.push({ senderId: fromUserId, message });

          await chat.save();

          // Emit message to room
          io.to(roomId).emit("messageReceived", {
            firstName,
            message,
            senderId: fromUserId,
            createdAt: new Date(),
          });
        } catch (err) {
          console.error("Error saving chat/message:", err);
          socket.emit("error", { message: "Failed to save message" });
        }
      }
    );

    socket.on("disconnect", async () => {
      onlineUsers.delete(loggedInUserId);

      // Save last seen in DB
      await User.findByIdAndUpdate(
        loggedInUserId,
        { lastSeen: Date.now() },
        { new: true, select: "firstName lastSeen" }
      );
      io.emit("onlineUsers", Array.from(onlineUsers));
    });
  });
};

module.exports = initializeSocket;
