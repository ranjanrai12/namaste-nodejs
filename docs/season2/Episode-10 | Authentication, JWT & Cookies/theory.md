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

  - User ID

  - Expiration time

  - Signature (secret)

- On every new API call (e.g., get profile, update profile, send friend request), the **JWT is sent back to the server** for validation.

### 4. Why Cookies?

Manually attaching JWT to every request is inconvenient.
So, browsers use cookies as an automatic storage and transport mechanism.

- After login:

  - Server sends back the JWT inside a cookie.

  - Browser automatically stores the cookie.

- On every new API request:

  - Browser automatically attaches the cookie (and hence the JWT) to the request.

- Server validates the JWT from the cookie before fulfilling the request.

### 5. Cookie & JWT Expiry

- Both JWT and cookies can have e**xpiry times.**

- Examples:

  - Cookie valid for **1 hour / 1 day / 1 month / lifetime.**

  - Once expired → JWT is invalid → Server rejects the request → User must **login again.**

This is why some websites **remember** (long expiry), while others log out quickly (short expiry).

![alt text](/assets/season2/image2.png)
