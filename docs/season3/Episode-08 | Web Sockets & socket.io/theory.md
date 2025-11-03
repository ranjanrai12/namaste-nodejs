# Episode-08 | Web Sockets & socket.io

## Overview

The goal is to allow two connected users on a social platform to chat with each other in real-time using WebSockets (via the [Socket.io](https://socket.io/) library).

- **WebSockets:** A communication protocol that provides a persistent, bidirectional connection between a client (browser) and a server. Unlike HTTP (request-response), the server can push data to the client at any time.

- **Key Features:**

  - **Low Latency:** Fast, real-time communication.
  - **Bidirectional:** Both client and server can initiate communication.
  - **Event-Based:** Communication happens by emitting and listening for custom events (e.g., join-chat, send-message).

- **Rooms:** A server-side concept that allows you to group sockets (clients). You can then send a message to all sockets in a room. We'll create a unique room for every pair of chatting users.

## Backend Setup

```bash
npm install socket.io
```

`utils/socket.js`

```js
const socket = require("socket.io");
const crypto = require("crypto");

// Utility function to create a secure, unguessable room ID using SHA-256 hashing
// It ensures users always join the same room regardless of who is sender/receiver
const createSecureRoomId = (userId1, userId2) => {
  // Step 1: Sort the user IDs so that room ID is consistent irrespective of the order
  const sortIds = [userId1, userId2].sort();

  // Step 2: Join the sorted IDs with an underscore to form a single string
  const roomString = sortIds.join("_");

  // Step 3: Hash the string using SHA-256 to generate a unique, secure room ID
  return crypto.createHash("sha256").update(roomString).digest("hex");
};

// Main function to initialize Socket.IO
const initializeSocket = (server) => {
  // Configure Socket.IO and allow CORS for the frontend application
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL (React, Vite, etc.)
      credentials: true, // Allow cookies and auth headers if needed
    },
  });

  // Event listener for new socket connections
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Handle user joining a chat
    socket.on("joinChat", ({ firstName, fromUserId, toUserId }) => {
      // Create a secure, unique room ID for the chat session
      const roomId = createSecureRoomId(fromUserId, toUserId);

      console.log(`${firstName} joining the room ${roomId}`);

      // Add the user to the specific chat room
      socket.join(roomId);
    });

    // Handle message sending
    socket.on("sendMessage", ({ firstName, message, fromUserId, toUserId }) => {
      // Re-create the same room ID to ensure delivery in the correct room
      const roomId = createSecureRoomId(fromUserId, toUserId);

      console.log(`${firstName} sending a message: ${message}`);

      // Broadcast the message to all users in the room
      io.to(roomId).emit("messageReceived", {
        firstName,
        message,
        senderId: fromUserId,
        createdAt: new Date(), // Send timestamp with the message
      });
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

// Exporting the initialization function for use in the main server file
module.exports = initializeSocket;
```

```js
// app.js
const express = require("express");
const http = require("http");
const mongooseDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("./utils/cronJob");
// Middlewares
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");

app.use("/auth", authRouter);

app.use("/profile", profileRouter);

app.use("/request", requestRouter);

app.use("/user", userRouter);

const server = http.createServer(app);
initializeSocket(server);

mongooseDB()
  .then((res) => {
    console.log("Database connected successfully");
    server.listen(3000, () => {
      console.log("Application is running on 3000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
```

## Frontend Setup (React)

```bash
npm install socket.io-client
```

```js
// chat.jsx(UI code)
import React, { useEffect, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Chat = () => {
  const [message, setMessage] = useState("");
  const { toUserId } = useParams();
  const [allIncomingMessages, setAllIncomingMessages] = useState([]);
  const user = useSelector((state) => state.user);
  const fromUserId = user?._id;

  const sendMessage = () => {
    try {
      const socket = createSocketConnection();
      socket.emit("sendMessage", {
        firstName: user.firstName,
        fromUserId,
        toUserId,
        message,
      });
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!fromUserId) return;
    console.log("Start");
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      fromUserId,
      toUserId,
    });

    socket.on(
      "messageReceived",
      ({ message, firstName, senderId, createdAt }) => {
        setAllIncomingMessages((prev) => [
          ...prev,
          { message, firstName, senderId, createdAt },
        ]);
        console.log(allIncomingMessages);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [fromUserId, toUserId]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-base-200 p-2 rounded-lg shadow-inner max-w-3xl mx-auto">
      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 py-4">
        {/* Incoming Message */}
        {allIncomingMessages.map((message, index) => {
          const isOwnMessage = message.senderId === fromUserId;
          return (
            <div
              key={index}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src={
                      isOwnMessage
                        ? "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                        : "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                    }
                  />
                </div>
              </div>

              <div className="chat-header">
                {isOwnMessage ? "You" : message.firstName}
                <time className="text-xs opacity-50 ml-2">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>

              <div
                className={`chat-bubble ${
                  isOwnMessage ? "chat-bubble-secondary" : "chat-bubble-primary"
                }`}
              >
                {message.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <div className="p-2 bg-base-100 flex gap-2 sticky bottom-0">
        <input
          type="text"
          placeholder="Type your message…"
          className="input input-bordered flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="btn btn-primary px-6">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

// utils/socket.js
import io from "socket.io-client";
// Function to create a socket connection from the client side
// This connects to the Socket.IO server using the URL defined in environment variables
export const createSocketConnection = () => {
  /**
   * Returns a new Socket.IO client instance
   *
   * - `import.meta.env.VITE_SOCKET_URL` refers to the backend Socket.IO server URL
   *   declared in a `.env` file compatible with Vite
   * - You must prefix environment variables with `VITE_` for Vite to expose them to the client
   *
   * Example .env.development file:
   *   VITE_SOCKET_URL=http://localhost:3000
   */
  return io(import.meta.env.VITE_SOCKET_URL);
};
```
