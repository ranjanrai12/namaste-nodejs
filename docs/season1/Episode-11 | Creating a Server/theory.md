# Episode-11 | Creating a Server

## What Exactly is a Server?

Ans: A `server` can mean two things:

- `Hardware`: A physical computer (like your laptop, but more powerful) that stores data and runs programs.

- `Software`: A program (like a web server) that delivers data to other computers (clients).

## Server Hardware vs. Software

- `Server Hardware`: A physical machine with:

  - CPU, RAM (memory), Storage (hard disk).
  - Runs an OS (Linux/Windows).

  `Example:` AWS EC2 (a rented virtual computer in the cloud).

- `Server Software`: A program that:

  - Listens for requests (e.g., from your browser).
  - Sends back responses (e.g., a webpage).

  `Examples:`

  Web Server (HTTP server like Node.js, Apache).

  File Server (FTP for file downloads).

  Email Server (SMTP for sending emails).

## Why Use Cloud Servers (Like AWS)?

| **Your Laptop**         | **Cloud Server (AWS)** |
| ----------------------- | ---------------------- |
| Limited RAM/Storage     | Easily upgradeable     |
| Internet/power may fail | 24/7 uptime            |
| IP changes often        | Fixed (dedicated) IP   |
| Manual maintenance      | Managed by AWS         |

## How Clients and Servers Communicate?

![alt text](/assets/season1/image-12.png)

`Step-by-Step Flow`:

`Client`: Open a browser and type https://namastedev.com

`Request Sent`: Your browser asks the server for the webpage.

`Server Listens`: The server software (e.g., Node.js) receives the request.

`Response Sent`: Server sends back the webpage (in small chunks called `packets`).

`Browser Displays`: Your browser puts the packets together and shows the page.

### `Key Terms to know about`:

`TCP/IP`: Rules for sending/receiving data over the internet.

`HTTP/HTTPS`: Language for web browsers and servers.

`FTP`: Language for file transfers.

`Socket`: A temporary connection between client and server.

## Why Data is Sent in "Packets"?

![alt text](/assets/season1/image-13.png)

- Large files (like videos) are split into small pieces (packets).

- Packets travel faster and can be reassembled by the client.

- If one packet is lost, only that part is re-sent (efficient!).

## Streams and Buffers in Node.js

`Stream`: A continuous flow of data (like a pipe carrying water).

Example: Video loading progressively in chunks.

`Buffer`: Temporary storage for data chunks before processing.
Analogy: A bucket catching water from the pipe (stream).

### How They Work

- Data is split into packets (TCP/IP protocol).
- Node.js uses buffers to collect packets.
- Streams process buffers sequentially.
  - Real-world: "Buffering" in videos = filling buffers before playback.

#### Why It Matters

- Efficient memory usage (no need to load entire files at once).
- Critical for large files (e.g., video streaming).

## Domain Names vs. IPs

![alt text](/assets/season1/image-17.png)
![alt text](/assets/season1/image-16.png)

### DNS Servers: The Internet’s Phonebook

- You type namastedev.com → Browser queries a DNS server.
- DNS maps namaste.com → IP (e.g., 142.250.190.46).

`Analogy`

- `Domain` = Verbal address ("Akshay’s house, Dehradun").
- `IP` = GPS coordinates (exact location).

## Multiple Servers on One Machine

![alt text](/assets/season1/image-15.png)

`Ports`: Application Door Numbers.

One physical server can run multiple applications on different ports:

:3000 → React app (frontend).

:3001 → Node.js API (backend).

:5432 → PostgreSQL database.

`How Requests Are Routed:`

namastedev.com → Default port (:80 for HTTP, :443 for HTTPS).

namastedev.com:3001/api → Directs to Node.js API.

```js
// Frontend Server (React)
const http = require("http");
http
  .createServer((req, res) => {
    res.end("Hello from Frontend!");
  })
  .listen(3000);

// Backend Server (Node.js API)
http
  .createServer((req, res) => {
    res.end("API Response!");
  })
  .listen(3001);
```

## Real-World Server Architecture

![alt text](/assets/season1/image-14.png)

## How Web Servers Work ?

Basic HTTP Request Flow

- `Client Request`: A user requests a URL (e.g., namastedev.com).
- `DNS Resolution`: The domain name is resolved to an IP address.
- `TCP Socket Connection`: A connection is established between the client and server.
- `HTTP Server Handling`:
  - The server processes the request.
  - Sends back the response (HTML, JSON, etc.).
- `Connection Closure`: The socket closes after sending the response.

`Example Workflow`

User requests namastedev.com → Server sends HTML → Connection closes.

User navigates to another page → New request → New connection → Response → Connection closes.

## Why WebSockets?

Socket connection is One-way (client → server) and Short-lived (per request). Where web sockets

- Avoids repeated connection setups.
- Enables real-time bidirectional communication.
- Useful for live notifications, chat apps, stock tickers.

## Creating an HTTP Server in Node.js

```js
const http = require("http");

// Create a server
const server = http.createServer((req, res) => {
  if (req.url === "/get-secret-data") {
    res.end("There is no secret data!");
  } else {
    res.end("Hello World!");
  }
});

// Listen on port 7777
server.listen(7777, () => {
  console.log("Server running on http://localhost:7777");
});
```

Notes:
`http.createServer()`: Creates an HTTP server instance.
`req (Request)`: Contains client request details (URL, headers).
`res (Response)`: Used to send data back to the client (res.end()).
`server.listen()`: Starts the server on a specified port.

## Limitations of Native HTTP Module

- `Low-level`: Manual routing is tedious.
- `No built-in middleware`: Handling cookies, sessions, etc., is complex.
- `Scalability issues`: Hard to manage in large applications.
