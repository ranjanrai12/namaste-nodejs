const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const createSecureRoomId = (userId1, userId2) => {
  const sortIds = [userId1, userId2].sort();
  const roomString = sortIds.join("_");
  // Created secure unguessable roomId
  return crypto.createHash("sha256").update(roomString).digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
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
        try {
          const roomId = createSecureRoomId(fromUserId, toUserId);
          let chat = await Chat.findOne({
            participants: { $all: [fromUserId, toUserId] },
          });
          if (!chat) {
            // create if doesn't exists
            chat = new Chat({
              participants: [fromUserId, toUserId],
              message: [],
            });
          }
          chat.messages.push({ senderId: fromUserId, message });

          await chat.save();

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

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initializeSocket;
