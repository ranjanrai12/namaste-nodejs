# Episode-14 | Building Feed API & Pagination

## Feed API

### Overview

The **Feed API** returns a list of other users, It must **exclude**:

- The logged-in user
- is already connected (accepted connection)
- is already ignored
- has an existing connection request with the logged-in user (either sent or received).

```js
/**
 * @route GET /user/feed
 * @description Get all users
 */
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
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
    });
    res.json({ data: users });
  } catch (err) {
    res.status(500).send("Error fetching feed: " + err.message);
  }
});
```

## Feed API Pagination

### Objective

Implement **pagination** in the `/feed` API to avoid returning all user records at once. This ensures better performance, scalability, and user experience — especially when dealing with thousands of users.

### MongoDB Pagination Logic

- **.skip(n)** → Skips the first `n` documents.
- **.limit(n)** → Limits the number of documents returned.

Example:

```js
User.find().skip(20).limit(10);
```

This skips the first 20 records and returns the next 10.

### Pagination handle inside the feed API

```js
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
```
