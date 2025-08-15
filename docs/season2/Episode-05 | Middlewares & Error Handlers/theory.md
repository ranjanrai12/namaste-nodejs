# Episode-05 | Middlewares & Error Handlers

## Route Handlers

- Functions that process HTTP requests and send responses.
- Signature: `(req, res, next) => { ... }`

- **Key Points:**
  - Must call `res.send()` to complete the request.
  - Without `res.send()`, the request hangs indefinitely.
  - Can have multiple handlers per route

### Multiple Handlers

```js
// 1: Example 1
app.get(
  "/user",
  (req, res, next) => {
    console.log("This is the first middleware function");
    res.send({
      name: "Ranjan",
    });
    console.log("This will be executed after the response is sent");
    next();
  },
  (req, res) => {
    console.log("This is the second middleware function");
    /** Here it will give and Error because server already responded to the client in the 1st handler

     res.send({
      age: 30,
     });
    **/
  }
);
// Example 2
app.get(
  "/user",
  (req, res, next) => {
    console.log("This is the first middleware function");
    res.send({
      name: "Ranjan",
    });
    next();
    console.log("This will be executed after the response is sent");
  },
  (req, res) => {
    console.log("This is the second middleware function");
  }
);
// Output
/**
 * This is the first middleware function
 * This is the second middleware function
 * This will be executed after the response is sent
 */

// Example 3:
app.get(
  "/user",
  (req, res, next) => {
    console.log("This is the first middleware function");
    res.send({
      name: "Ranjan",
    });
    next();
    console.log("This will be executed after the response is sent");
  },
  (req, res) => {
    res.send({
      age: 30,
    });
    console.log("This is the second middleware function");
  }
);
// Output
/**
 * This is the first middleware function
 * Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client at ServerResponse.setHeader ..
**/
**`Notes`**: It throws an Error because server already responded to the client in the 1st handler

// Example 4:
app.get(
  "/user",
  (req, res, next) => {
    console.log("This is the first middleware function");
    console.log("This will be executed after the response is sent");
    next();
  },
  (req, res, next) => {
    console.log("This is the second middleware function");
    next();
  },
  (req, res, next) => {
    console.log("This is the third middleware function");
    next();
  }
);
/**
 **In the terminal we will get output below**
 *  This is the first middleware function
 * This will be executed after the response is sent
 * This is the second middleware function
 * This is the third middleware function

**In Server response**
* We will get in response 404 not found
* <pre>Cannot GET /user</pre>
* The reason when we write next() then next handler must be present else we will get 404 not found.
**/
```

### Multiple Route Handlers Syntax

- **Basic Syntax**: chaining multiple handlers for a single route

```js
app.METHOD(path, handler1, handler2, ..., handlerN)
```

- **Array Syntax**: Handlers can be passed as an array

```js
app.METHOD(path, [handler1, handler2, ..., handlerN])
```

- **Mixed Syntax**: Combine standalone handlers and arrays

```js
app.METHOD(path, handler1, [handler2, handler3], handler4);
```

### Critical Rules

- **Response**
  - Once `res.send()` is called, the chain ends.
  - Any subsequent `res` methods will throw `errors`.
- **next() Behavior:**
  - Must be called to continue to `next` handler
  - If no more handlers exist after next(), Express returns "Cannot GET [path]"

## Middleware

- Functions that execute between request and response.
- Same signature as route handlers but typically used for:
  - Authentication
  - Logging
  - Data parsing
  - Error handling

### Middleware Implementation

**Authentication Middleware**

```js
// Folder -> Middlewares/auth
// Custom authentication middleware
const authMiddleware = (req, res, next) => {
  const token = "ABC";
  if (token !== "ABC") {
    return res.status(401).send("Unauthorized");
  }
  next(); // Pass to next middleware/handler
};

const userMiddleware = (req, res, next) => {
  const token = "XYZ";
  if (token !== "XYZ") {
    return res.status(401).send("Unauthorized");
  }
  next(); // Pass to next middleware/handler
};

module.exports = { authMiddleware, userMiddleware };

//app.js
const { authMiddleware, userMiddleware } = "./middlewares/auth";
app.use("/admin", authMiddleware);

app.get("/user/getData", userMiddleware, (req, res) => {
  res.send("Data fetched successfully");
});
```

**Error Middleware**

```js
//Example 1:
// Global error handler (LAST middleware)
app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  if (error) {
    res.status(500).send("Server error");
    // This will be never send because there is no error at first place and we have kept the error middleware at first place, So remember order matters.
  }
});

app.get("/data", async (req, res) => {
  try {
    const data = await fetchData();
    res.send(data);
  } catch (err) {
    res.status(500).send("Data fetch failed");
  }
});

//Example 2:
// Route-level error handling
app.get("/data", async (req, res) => {
  try {
    const data = await fetchData();
    res.send(data);
  } catch (err) {
    res.status(500).send("Data fetch failed");
  }
});

// Global error handler (LAST middleware), If in some handler Error is not handle then below global error handler can easily catch it.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});
```

**Note**: In Express, an error-handling middleware is defined like:

```js
app.use((err, req, res, next) => { ... });

```

The first argument (`err`) is special — Express will only call this middleware when there’s an error in the pipeline.
