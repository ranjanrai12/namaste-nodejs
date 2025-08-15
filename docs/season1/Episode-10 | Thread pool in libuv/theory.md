# Episode-10 | Thread pool in libuv

#### What is `tick`:

One cycle of the event loop is known as `tick`

#### `Home work 1` Read about event loop from official doc(Note there are two more(1: `Pending callbacks`, 2: `idle, prepare`) phase on event loop please check documentation) -> pending

#### `Home work 2` Read the event loop from libuv documentation as well.

![alt text](/assets/season1/image-9.png)

Event loop code:
![alt text](/assets/season1/image-10.png)

- What is `thread`:
- In uv_thread_pool_size by default there are four threads .

#### When libuv uses the thread pool

Ans: `fs`, `dns.lookup`, `crypto`, `crypto.pbkdf2`, `user specified input`

![alt text](/assets/season1/image-11.png)

#### Is nodejs is a single thread or multi threaded ??

ANs: If the pice of code is given is synchronous then it's a single threaded and if it's asynchronous then it's a multithreaded because callstack offloads task to libuv and and libuv have UV_thread_pool where it have four more thread.

#### Can we increase/ decrease of thread pool size ?

Ans: Yes be assigning the value to `process.UV_THREADPOOL_SIZE = number`.

```js
const crypto = require("node:crypto");
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("1: crypto.pbkdf2 done");
});
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("2: crypto.pbkdf2 done");
});
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("3: crypto.pbkdf2 done");
});
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("4: crypto.pbkdf2 done");
});
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("5: crypto.pbkdf2 done");
});
```

In the above example we see in the terminal starting 4 response will be at the same time but sequence is not guarantee to be in the same order, and 5th response will come later because it waits if out of 4 thread will be empty then it it's starts it s execution.

In below example now we have increased the thread pool size so all the 5 response will come at the same time but sequence is not the same.

```js
const crypto = require("node:crypto");
process.env.UV_THREADPOOL_SIZE = 8;
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("1: crypto.pbkdf2 done");
});
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("2: crypto.pbkdf2 done");
});
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("3: crypto.pbkdf2 done");
});
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("4: crypto.pbkdf2 done");
});
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("5: crypto.pbkdf2 done");
});
```

`Note`: uv thread is only use for `fs`, `dns.lookup`, `crypto`, `crypto.pbkdf2`, `user specified input`.

#### Suppose if there is server and multiple requests coming, so does api uses thread pool ?

Ans: No

For this we need to understand how libuv interact with OS..

## API Request Handling with epoll and libuv

- `Socket and Socket Descriptors (File Descriptors)`: A `socket` is a communication endpoint that allows an application to send or receive data over a network.

- Every socket has a unique identifier known as a `file descriptor (FD)`. In the context of network communication, it's also called a `socket descriptor`.

- A file descriptor is an integer that represents an open file or socket in the operating system.

#### Blocking Operations:

- When data is being written or read from a socket, this can be a blocking operation. The thread executing this operation may be blocked and cannot perform any other tasks until the operation completes.

- If there are multiple connections and each connection involves blocking I/O, a thread-per-connection model will consume excessive resources.

#### Thread-per-Connection Model:

- In the thread-per-connection model, each incoming request (or connection) is assigned a dedicated thread.

- `Problem:` If thousands of users are making requests, this would mean thousands of threads are created, leading to high resource usage and overhead, which is not scalable.

#### Scalable I/O with epoll

Q: What is epoll ?
Ans:

- `epoll (Event Polling) In linux and kqueue(MacOS)`: is a scalable I/O event notification mechanism used in Linux.

- It is designed to efficiently manage multiple sockets, handling many connections concurrently without the need to assign a thread per connection.

- `epoll` is an alternative to traditional `I/O models` like `select` or `poll`, which are not scalable when dealing with a large number of connections.

#### How epoll Works:

- Instead of creating a thread for each connection, epoll allows us to manage multiple connections within a single or a few threads.

- It works by monitoring a set of `sockets (file descriptors)` for events such as data being ready to read or write.

- `epoll` maintains an `epoll descriptor`, which is a special file descriptor that is used to register multiple socket descriptors. The `epoll descriptor` efficiently manages a large number of sockets.

#### How libuv Works with epoll:

- `libuv` uses `epoll` to efficiently manage multiple concurrent connections in Node.js.
- When `epoll` detects activity on a `socket`, it notifies `libuv`.

- `libuv` then schedules the callback function associated with that event and executes it in the `event loop`.

#### Operating System-Level Implementation:

`Hardware`: The physical resources where the operating system runs.

`Kernel`: The core part of the operating system responsible for managing resources, including processes, memory, and I/O operations.

`Processes`: Programs or applications running on the system. In the case of Node.js or similar applications, these run as processes that utilize the operating system's kernel to handle system-level operations.

`Epoll Mechanism`: At the kernel level, epoll is responsible for efficiently managing I/O events for multiple file descriptors (sockets) and notifying applications when data is ready to be read or written.

## `Home work`: Read about epoll(linux) what DS is using, fds(socket descriptor), Event Emitters, Streams and Buffers, Pipes

## Keep in mind

- `Don't block the main thread`:

  - don't use Sync method
  - Heavy json objects(like json.parse or stringify on heavy object) it takes time don't do it.
  - Complex regex(Don't do it in the main thread)
  - Complex calculation/loops(Don't do it in the main threads)

- `Data Structure is important`: - like epoll uses red black tree DS tree, `Timers` phase use the `min heap` DS.

- `Naming is very important`: `process.nextTick` and `setImmediate`
