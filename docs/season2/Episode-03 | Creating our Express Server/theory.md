# Episode-03 | Creating our Express Server

## Setting Up the Project from Scratch

### Initializing the Project

- Create a new folder for the project:
- Initialize a Node.js project using npm:

```bash
npm init
```

- Fill in details (name, version, description, etc.) or press Enter to accept defaults.
- This generates a `package.json` file containing project metadata.

### Project Structure

- Create an src folder (source code directory):
- Inside `src`, create `app.js` (entry point of the application):
- Add a simple `console.log` to test:

```js
console.log("Starting a new project!");
```

- Run the file:

```bash
node src/app.js
```

### Installing Express.js

- Install Express (a Node.js framework for building servers):

```bash
npm install express
```

- This creates `node_modules` (stores all dependencies).
- Updates `package.json` with `express` as a dependency.

### Understanding Dependencies

- `node_modules:` Contains all installed packages (including transitive dependencies).
- `package-lock.json:` Locks exact dependency versions (ensures consistency).
- **Semantic Versioning (^ and ~)**:
  - `^4.19.0` → Allows minor & patch updates (e.g., `4.20.0`).
  - `~4.19.0` → Allows only patch updates (e.g., `4.19.1`).
  - No symbol → Strictly uses the exact version.

### Creating a Basic Express Server

```js
// app.js File
const express = require("express");
const app = express();

// Basic route handler
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/test", (req, res) => {
  res.send("Hello from /test!");
});

app.get("/hello", (req, res) => {
  res.send("Hello Hello Hello!");
});

// Start server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Using Nodemon for Auto-Restart

- Install Nodemon globally (auto-refreshes server on file changes):

```bash
npm install -g nodemon
```

- Run the server with Nodemon:

```bash
nodemon src/app.js
```

- Now, any changes to app.js will automatically restart the server.
