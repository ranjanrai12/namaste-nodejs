# Episode-10 | Authentication, JWT & Cookies

## Authentication with JWT and Cookies

Authentication ensures that only logged-in users can access protected resources (like profile, edit profile, send requests, etc.)

### 1. Signup and Login

- **Signup API**: User registers with email + password. Passwords are hashed and stored securely in the database.

- **Login API:** User provides email + password.

  - Server validates credentials.

  - If valid → server generates a **JWT (JSON Web Token).**

  - Server sends back the JWT inside a **cookie** in the response.

### 2. How Communication Works

- Client (browser/app) ↔ Server communication happens over **TCP/IP.**
- Each request:

  - Connection is made.

  - Data/request is sent.

  - Server processes it.

  - Response is sent.

  - Connection is closed.

Because connection is closed after every request, authentication must be validated **every time** a new request is made.

### 3. Role of JWT

- A JWT is a signed token that proves the user is authenticated.

- Once the user logs in, the server issues a JWT containing:

  - User ID // **uniq identifier**

  - Expiration time

  - Signature (secret)

- On every new API call (e.g., get profile, update profile, send friend request), the **JWT is sent back to the server** for validation.

### 4. Why Cookies?

Manually attaching JWT to every request is inconvenient.
So, browsers use cookies as an automatic storage and transport mechanism.

- After login:

  - Server sends back the `JWT` inside a cookie.

  - Browser automatically stores the cookie.

- On every new API request:

  - Browser automatically attaches the cookie (and hence the JWT) to the request.

- Server validates the JWT from the cookie before fulfilling the request.

### 5. Cookie & JWT Expiry

- Both JWT and cookies can have **expiry times.**

- Examples:

  - Cookie valid for e.g **1 hour / 1 day / 1 month / lifetime.**

  - Once expired → JWT is invalid → Server rejects the request → User must **login again.**

This is why some websites **remember** (long expiry), while others log out quickly (short expiry).

![alt text](/assets/season2/image2.png)

## JWT Token & Cookie-based Authentication

### JSON Web Tokens (JWT)

- **A JWT (JSON Web Token)** is a secure, compact way to transmit information between two parties (usually client ↔ server) as a digitally signed token. It’s commonly used for **authentication and authorization**.

### Structure of a JWT

A `JWT` is a string made up of three parts, separated by dots (.):

> xxxxx.yyyyy.zzzzz

- Header (metadata about the token)

```json
{
  "alg": "HS256", // algorithm used (e.g., HMAC SHA256)
  "typ": "JWT"
}
```

- Payload (the actual data — claims)

```json
{
  "id": "12345",
  "email": "user@example.com",
  "role": "admin",
  "exp": 1712345678 // expiration timestamp
}
```

- **Signature** (verification)

  - Created by hashing `header + payload` with a **secret key**.

  - Ensures the token hasn’t been tampered with.

### Cookies

A **cookie** is a **small piece of data** that a server sends to a client’s browser. The browser stores it and automatically sends it back to the server with every request to the same domain.
**Security Features:**

- `httpOnly`: Prevents JavaScript access (blocks XSS attacks).

- `secure`: Only works over HTTPS (in production).

- `expires`: Sets cookie expiry (e.g., 7d for 7 days).

## Authentication Flow

### Step 1: User Login

- User sends email and password.

- Server validates credentials.

- If valid:

  - Generates a JWT token with userId.

  - Attaches token to an HTTP-only cookie.

  - Sends cookie in the response.

```js
const token = jwt.sign({ id: user._id }, "your-secret-key", {
  expiresIn: "1d",
});

res.cookie("token", token, {
  httpOnly: true,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
});

res.json({ message: "Login successful" });
```

## Step 2: Accessing Protected Routes

- User makes a request (e.g., `/profile`).

- Browser automatically sends the cookie.

- Server:

  - Extracts the JWT token from the cookie.

  - Verifies the token using the **secret key.**

  - Fetches user data from DB.

  - Grants access if valid.

```js
const userAuth = async (req, res, next) => {
  try {
    // get the token from cookies
    const { token } = req.cookies;

    // If token is not present, return 401 Unauthorized
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedToken;

    // Check if user exists in the database
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("Error " + err.message);
  }
};

module.exports = {
  userAuth,
};

// app.js
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).send("Error fetching profile: " + err.message);
  }
});
```

## User Schema Methods

Mongoose schema methods allow to attach `reusable functions` directly to MongoDB documents(e.g user).

```js
userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.comparePassword = function () {
  const user = this;
};

// app.js
app.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(req);

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
    }
    console.log("User found:", user);
    const token = user.getJWT(user);
    res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});
```

### Important Implementation Notes

- Never Use Arrow Functions

```js
// ❌ Wrong (loses 'this' binding)
userSchema.methods.getJWTToken = () => { ... }

// ✅ Correct
userSchema.methods.getJWTToken = function() { ... }
```

- Password Comparison Order Matters

```js
// ❌ Dangerous (reversed arguments)
bcrypt.compare(this.password, enteredPassword);

// ✅ Correct
bcrypt.compare(enteredPassword, this.password);
```

- Environment Variables

  Always store secrets like JWT_SECRET in **.env** files.
