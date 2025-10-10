# Episode-13 | ref, Populate & Thought process of writing APIs

## Review Request API

### Overview

The **Review Request API** allows a logged-in user (receiver of a connection request) to either **accept** or **reject** a connection request.

Instead of maintaining two separate APIs (one for accept and one for reject), a **single API** is created where the **status** is passed dynamically (`accepted` or `rejected`).

### API end Point

```js
/review/send/:status/:requestId
```

- **:status** → The new status for the request (`accepted` or `rejected`)
- **:requestId** → The ID of the connection request

### Authentication

- Requires User **Authentication**.
- Only the logged-in user (who is the **receiver** of the request) can accept/reject.
- Auth middleware (`userAuth`) ensures:

  - Token is valid.
  - User exists in DB.
  - Logged-in user is attached to `req.user`.

### Validations & Checks

Before updating a request, the API performs strict **validation**:

**1: Validate Status**

- Allowed values: `accepted` or `rejected`.

- If any other value is passed → **400 Bad Request** (`Status not allowed`).

**2: Validate Request ID**

- Request must exist in DB.

- If not found → **404 Not Found** (Connection request not found).

**3: Validate Receiver**

- Only the **receiver (toUser)** can review the request.

- If someone else (like the sender) tries → API returns **404 Not Found.**

**4: Validate Current Status**

- Only requests in **interested** state can be updated to `accepted` or `rejected`.

- If already `accepted`, or `rejected` → request cannot be modified.

```js
/**
 * Review connection request
 * @route POST /request/review/:status/:requestId
 * @access Private
 * @desc Review connection request
 * @body { status: "accepted" | "rejected" }
 */
requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const { status, requestId } = req.params;
  // allowed only accepted and rejected
  const allowedStatus = ["accepted", "rejected"];
  // Check if status is allowed
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status type: " + status });
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
});
```

## Post API vs Get API – Thought Process

When building APIs, always think like a **security guard of your database.**

- **Post APIs** insert data into the database.

  - Threat: attackers can send **malicious or invalid data** that gets stored.
  - Responsibility: **validate & sanitize** every piece of input before saving.
  - "Save to database" should always be the **last step** after all checks.

- **Get APIs** fetch data from the database.
  - Threat: attackers can try to **steal unauthorized information.**
  - Responsibility: ensure that only **authorized users** get only the **allowed data.**
  - Avoid **over-fetching** (never send sensitive fields like password, email, etc.).

## Requests Received API

### Overview

Fetch all **pending connection requests** (status = interested) received by the **logged-in user.**

### Steps

#### 1: Authenticate User

- Use `userAuth` middleware to ensure the user is logged in.
- The logged-in user is available at `req.user.`

#### 2: Query the Database

- `ConnectionRequest.find()` to search requests.
- Conditions:
  - `toUser = req.user._id`
  - `status = "interested"` (only pending requests).

#### 3: Populate User Info

- Each request has a `fromUser` field.
- Use Mongoose `ref + populate()` to fetch details of the sender.
- But `only include safe fields` (firstName, lastName, photo, etc.).

#### Return Response

- Send back a clean JSON with the list of requests.

```js
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
```

## Mongoose ref and populate()

- `ref`: Creates a relationship between collections.

**Example** in connectionRequest schema:

```js
fromUser: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}

```

- `populate()`: Fetches related data in one query.

```js
.populate("fromUser", "firstName lastName photo")

```

- "fromUser" → field to populate.
- "firstName lastName photo" → only include selected fields.

## User Connections API

This API is responsible for fetching user connections (mutual accepted connection requests).
It ensures that once two users accept a connection request, they appear in each other’s connection list.

### Business Logic

- A connection exists if **status = "accepted"**.
- A logged-in user can appear in a connection request as either:
  - **Sender (fromUserId)**
  - **Receiver (toUserId)**
- Therefore, when querying connections:
  - Find all ConnectionRequest documents where:
    - `status: "accepted"` AND
    - `(fromUserId == loggedInUser._id OR toUserId == loggedInUser._id)`

## API Endpoint

GET `/api/user/connections`

```js
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
```
