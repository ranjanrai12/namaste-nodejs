# Episode-02 | JS on Server

## 1: What is a Server?

- A **server** is simply a remote computer (a CPU/machine) that listens to client requests and responds.

- When we open a website (e.g., `google.com`), your browser (the client) sends a request to a **server**, which processes it and sends back the response (HTML, CSS, JS, images, etc.).

**Example**

- We type google.com in your browser.
- It maps to an IP address like 2`65.123.xxx.xxx`.
- That IP points to a server running Google’s application.
- Browser (client) requests data, and the server responds.

## 2. JavaScript Before Node.js

- Originally, J**avaScript only ran inside browsers.**
- Other languages (Java, Python, C++, PHP, etc.) powered the backend (servers).
- This created a split:
  - **Frontend**: JavaScript (React, Angular, Vanilla JS).
  - **Backend**: Java, Python, C++, etc.

## 3. The Birth of Node.js

- With `Node.js`, JavaScript could now **run outside the browser**—on the server.
- This unified the tech stack:
  - Developers could use **JavaScript on both frontend and backend.**
  - This gave rise to the concept of **Full-Stack JavaScript Developers.**
- Popular stack: **MERN, MEAN** (MongoDB, Express, React/Angular, Node).

## 4. V8 JavaScript Engine

- Node.js is built on **V8**, Google Chrome’s JavaScript engine.
- **V8 is not written in JavaScript**—it’s written in C++.
- `V8` can be embedded in any c++ program.

- `V8’s` role:
  - Takes your JavaScript code.
  - Converts it into **machine code** that the CPU understands (binary 0s and 1s).

**Key Point:**
When We **run JavaScript,** what actually happens is that **C++ programs** (like V8) convert it into machine code for the computer to execute.

## 5. ECMAScript (The Standards)

- **ECMAScript (ES)** defines the **rules and syntax** for JavaScript.

**Why important?**

Different browsers have different JavaScript engines (V8 in Chrome, SpiderMonkey in Firefox, Chakra in old IE, JavaScriptCore in Safari).

- Without `ECMAScript`, JavaScript would behave differently in each browser.
- With `ECMAScript`, all engines follow the same rules.

## 6. Node.js = V8 + Superpowers

- By itself, **V8** only executes JavaScript.
- It **cannot:**
  - Access the file system (read/write files).
  - Make network requests.
  - Connect to a database.
- **Node.js adds superpowers on top of V8** by embedding it inside a C++ application and exposing additional APIs.

**Examples of Node.js APIs:**

- `fs` → File System access.

- `http` → Create servers and handle requests.

- `net` → Networking.

- `process` → System interaction.

Thus, **Node.js = V8 (JavaScript execution) + C++ bindings (APIs & Modules).**

## 7. High-Level vs Low-Level Languages

- **Computer only understands binary (0s and 1s).**
- That’s why we use programming languages:

  - **Low-level**: Assembly, C.

  - **High-level**: C++, JavaScript, Python.

**Process:**

- When we write JavaScript (high-level).

- `V8` (written in C++) converts it into machine code (low-level).

- CPU executes machine code.

## 8. Repository Insights

- Node.js source code:

  - ~62% JavaScript.

  - ~21% C++.

  - Rest: TypeScript, Python, etc.

- Inside Node’s repo:

  - V8 is included as a **dependency** (in /deps/v8).
