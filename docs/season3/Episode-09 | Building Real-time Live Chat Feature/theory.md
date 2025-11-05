# Episode-09 | Building Real-time Live Chat Feature

## Goal

When two users chat via `Socket.IO` we get real-time messaging, but messages vanish on refresh

- Create a Mongoose schema to store chats and messages.
- Save incoming messages (from `sockets`) into MongoDB.
- Provide an API to load `past chats` when a user opens a chat window.
- Populate sender info for display.
- Load messages on the front end and map the DB shape to the UI format.

## Data model (Mongoose)

**Design decisions**

- `Chat` represents a conversation; `participants` is an array of `ObjectId` so the schema is extensible (2+ users, group chats later).

- `Message` is a sub-schema with its own `_id`, timestamps and `sender` reference. Having a separate schema gives each message its own `createdAt` and `_id`.

```js
// models/chat.js
```

## Save incoming messages from Socket.IO

Inside the server socket handler(`socket.js`)

- When server receives a message event, check if a `Chat` document for that set of participants already exists.
- If it exists, push the new message into `chat.messages` and save.
- If it does not exist, create a new `Chat` with `participants` and initial `messages`, save it.
- Use a try/catch around DB operations and await when calling async DB functions.

```js
// utils/socket.js
```

## API to fetch chat on page load

When the chat UI loads, call an API that returns the Chat document (including messages) for the logged-in user and the target participant.

```js
// routes/chat.js
```
