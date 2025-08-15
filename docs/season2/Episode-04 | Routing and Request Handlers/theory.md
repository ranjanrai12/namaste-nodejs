# Episode-04 | Routing and Request Handlers

## Understanding Routes in Express

### Route Matching is Sequential

- Checks routes top-to-bottom.
- **Wildcard** `app.use('/')` catches all routes if placed first.

### Route Paths

- `/hello` → Matches `/hello` only.
- `/hello/` → Matches `/hello/*` (any subpath).

### Order Matters!

```js
// Wrong (wildcard first → blocks other routes)
app.use("/", (req, res) => res.send("Wildcard!"));
app.get("/hello", (req, res) => res.send("Hello!")); // Never reached

// Correct (specific routes first)
app.get("/hello", (req, res) => res.send("Hello!"));
app.use("/", (req, res) => res.send("Wildcard!"));
```

### Setting Up Postman

- **Step 1: Install Postman**
  - Download from `postman.com.`
  - Install the desktop app (Windows/macOS/Linux).
- **Step 2: Create a Workspace**
  - Open Postman → Click **Workspaces** → **Create Workspace**.
  - Name it (e.g., `DevTinder`).
  - Set visibility (Personal/Team) as per choice.
- **Step 3: Create a Collection**
  - Inside the workspace → Click **Collections** → **Create Collection**
  - Name it (e.g., `DevTinder APIs`).
- **Step 4: Test your API Request**

  - Click **New** → **HTTP Request**.
  - Enter your api URL with proper method call(GET, POST, etc...)
  - Click **Send**
  - Save the **request** in the collection.

### Method-Specific Handling

```js
// GET /user → Returns user data
app.get("/user", (req, res) => {
  res.send({ name: "Ranjan" });
});

// POST /user → Saves data
app.post("/user", (req, res) => {
  console.log("Saving to DB...");
  res.send("Data saved!");
});
// ... and so on for delete and put and more.
```

### Advanced Routing Techniques

**Route Patterns**

| Pattern  | Meaning                        | Example Matches        |
| -------- | ------------------------------ | ---------------------- |
| `ab?c`   | `b` is optional                | `/ac`, `/abc`          |
| `ab+c`   | 1+ `b` characters              | `/abc`, `/abbc`        |
| `ab*cd`  | Anything between `ab` and `cd` | `/abXYZcd`, `/ab123cd` |
| `a(bc)?` | `bc` group is optional         | `/a`, `/abc`           |

- **Usage Notes:**

  - `?` makes the preceding character/group optional
  - `+` requires one or more of the preceding character
  - `*` matches any characters (including none)
  - Parentheses () create capture groups

    **Notes**:

    - `{b}` from `express V5` **?** no longer supported.
    - `+` Is not supported any more.

    Breaking Changes From `V5`: https://expressjs.com/en/guide/migrating-5.html#path-syntax

**Regular Expressions**

```js
// Matches paths containing 'a'
app.get(/a/, (req, res) => res.send("Contains 'a'"));

// Matches paths ending with 'fly'
app.get(/.*fly$/, (req, res) => res.send("Ends with 'fly'"));
```

**Dynamic Routes & Parameters**

```js
// URL: /user/101
app.get("/user/:id", (req, res) => {
  console.log(req.params.id); // → "101"
});

// URL: /user/101/name/Akshay
app.get("/user/:id/name/:name", (req, res) => {
  console.log(req.params); // → { id: "101", name: "Akshay" }
});
```

**Query Parameters**

```js
// URL: /search?q=nodejs
app.get("/search", (req, res) => {
  console.log(req.query.q); // → "nodejs"
});
```
