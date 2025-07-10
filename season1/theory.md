#### What is nodejs ?

Nodejs is a js run time and it built on top of chrome v8 engine, and nodejs can executes javascript code outside of browser.

Nodejs has an `event-driven` architecture and capable of `asynchronous I/O` aka `Non blocking I/O`.

#### History of nodejs

- `Nodejs` first release in `2009` and was developed by `Ryan dahl`.
- Wherever there is `javascript`, there is a `javascript engine` to run the code.
- When Ryan developed first time `nodejs` he built on top of `spider monkey(firefox's js engine)`.
- After 2 days he skipped `spider monkey` and started on top of `V8(Chrome's js engine)`.
- `Joyent` organization `hired Ryan` because they were also working on the same concept within there organization which js can run on server, so it's a big contribution of `Joyent` to sustain `nodejs`.
- Earlier name of `node.js` was `web.js`.
- Why Ryan was trying to develope nodejs, the reason behind is he wants to develop non-blocking I/O server.
- In 2010 NPM came into picture, so basically it's a central place where we can add new package.
- In `2011` `windows support` came where `joyent + MicroSoft` bring it, before that it was only available for mac and linux.
- In `2012`, `Ryan` left the leadership of nodejs and all responsibility was given to `issac` who is th `creator of npm` and he was the lead of nodejs from `2012`.
- In `2014`, `IO.js` came which was basically `forked` of `nodejs` and was developed by `Fedor`.
- Then in `2015` where `nodejs and IO.js` merged, and they decided that nodejs will not be handled by a single person so they created a `community` called `nodejs foundation`.
- In `2019`, `js foundation + nodejs` foundation community merged and named `open.js` foundation.
- So `open.js` community from 2019 took the handover of `nodejs`, and it's responsible for nodejs active development.

#### What is server

A server is a `computer or a system` that provides a service to another computer that is known as `client` over the `network`.

- js engine of `Node.js` which run on top of `V8(Chrome js engine)` i.e is written in `c++`, so basically which we execute our code of nodejs i.e is getting executed on top of c++.
- V8 can be embedded in any c++ program.
- Js Code -> V8(c++) Executes JS code -> Then machine understand our code.

- Node.js is a C++ application with V8 embedded into it.
- `EcmaScript` -> All the JS engine(V8, spider monkey, Chakra, etc..) have to follow these standards/rules. So it's a kind of community which decides what js have to follow the rules.

#### If nodejs is written on V8 then why not V8 is directly run on server instead of node

Because V8 follows ECMA Standard and cannot run the API on server like fetching the records from database, connecting to other server, file reading and lot more.
Only V8 can executes the core code of JS.

#### Why V8 is written or use C++.

Our computer understand binary code and we as a human cannot write low level code(machine or assembly code).
So C++ is a high level language which converted into machine code then assembly code then binary code which our computer understand.

#### Node REPL(`Read Evaluate Print Loop`)

In terminal just write node and hit enter it will open node REPL, where we can run any peace of javascript code.

#### globalThis

#### module and exports

- module by default protect their variable and function form leaking

\*\*\* There are two patterns for importing and exporting the module

- `common js module(cjs)`
- default use by node not required to declare in `package.json` it's optional.

```json
{
  "type": "commonjs"
}
```

- To exports: we use `module.exports`
- To import: we use `require`
- By default used in `nodejs`
- older way
- It works with synchronous
- It runs in `non-strict` mode.

```js
// test.js
function add(a, b) {
  const sum = a + b;
  console.log(sum);
}
module.exports = { add };
// app.js
const { add } = require("./test");
add(2, 3);
```

- `ES Modules(mjs or ESM or ES6)`
- To Enable mjs module system first we need to configure in `package.json`

```json
{
  "type": "module"
}
```

- To export: We use `export`
- To import: we use `import`
- By default used in angular, react..
- New way to use
- It works with asynchronous approach
- It runs in `strict` mode.

```js
// tets.js
export function add(a, b) {
  const sum = a + b;
  console.log(sum);
}
// app.js
import { add } from "./test";
add(2, 3);
```

- we can create the module and export the multiple file from there.

Example: calculate/index.js

```js
const sum = require("./add");
const { multiply } = require("./multiply");

module.exports = { sum, multiply };
```

app.js

```js
const { sum, multiply } = require("./calculate");
sum(2, 3);
multiply(2, 4);
```

Note: We don't need to write the index in path `./calculate/index`,
`Default entry point:`
When you import from a directory without specifying a file, the system looks for an "index.js" file within that directory as the default entry point.

Episode 5- Diving into nodejs github repo

- When we create a module that all code is wrapped inside the function and it's private to the scope we cannot access it outside, only to access it outside via module.exports.

app.js

```js
require("./xyz.js");
```

In the above code whatever code is there in xyz file that is wraps into a function and then execute it, so when it will wrapped into a function that will not inter fare with other thing in app.js file.

- When it is wrapped inside the function that function is IIFE(immediately invoked function expression).

  - immediately invokes the code.
  - privacy: Keep variable and functions safe.

- How do you get access to module.exports

  - Nodejs pass module as a one of the parameter to the IIFE.

  ```js
  (function (module, require) {
    function calculateMultiply(a, b) {
      console.log(a * b);
    }
    module.exports = { calculateMultiply };
  })();
  ```

- After wrapping the code in IIFE then it passes to V8 engine.

#### There are 5 steps behind the scene when using `require('/path')`

- Resolving the module: It checks type of file like whether it is a js file, node: util file , json file, etc. and it resolves it.
  - ./localpath
  - /.json
- Loading the module: It loads the file content, it means that whatever the code is present inside the file it gets the data.
  - File content is loading access to file type.
- Wraps inside the IIFE(Compile step): After loading the module it wraps inside the IIFE.
- Code evaluation: In this steps IIFE is executed and `module.exports` is `return`.
  - module.exports return.
- Caching: In this steps once module is imported in the code and later one in the some other module same module is required then it gives the result from caching instead of running above 4 steps.

// Learn How code is written under the hood like how require, IIFE works how module.exports working
// https://github.com/nodejs/node/blob/main/lib/util/types.js

#### Episode-06 | libuv & async IO

- Node.js has an `event-driven architecture` and `asynchronous I/O`.
- As we know javascript is `synchronous single threaded` language.
  - `Single threaded` means one command at a time.
- `Synchronous` and `asynchronous`:
  - `Synchronous` is a blocking architecture, so the execution of each operation depends on completing the one before it.
  - `Asynchronous` is a non-blocking architecture, so the execution of one task isn't dependent on another. Tasks can run simultaneously.
- Javascript is `synchronous` but with the super power of `node` it become `asynchronous`
- `Asynchronous tasks` take time to execute it where `Synchronous tasks` executes in millisecond.

- Javascript engine does not understand how to handle the asynchronous tasks it takes the code and executes in millisecond,
  Here libuv comes into the picture to handle the asynchronous task.

- V8 js Engine ---- libuv ---- OS(file, DB, WWW, timer & more..)

- JS engine do the synchronous things and most of the asynchronous things offloads to the libuv and libuv have superpower to do all those things.

#### Now How the `libuv` is doing all these works.

- libuv is a library and is written in c language.
- It made the asynchronous I/O simple.
- Its like a mediator between V8 and OS.
- libuv is written in low level code(i.e C) so its easy to communicate with OS.
- libuv is repository is present inside the nodejs repo just go to nodejs github and then go inside the
  deps folder and then search for uv(i.e is libuv).
  https://github.com/nodejs/node/tree/main/deps/uv
- Nodejs can do async I/O, we also have the non-blocking I/O ie the same thing.
- As we know V8 js engine have single thread(there is only one callstack), and whenever there is asynchronous tasks
  comes V8 handover to libuv with this approach our main thread is not blocking so that we call node is non-blocking I/O.
- I/O means input output like api call, reading the file requesting the file.

![alt text](<libuv diagram.jpeg>)

#### Sync, async, setTimeoutZero

- Read about utf8

- Few developers while importing core library modules they use to write `required("node:moduleName)"` but this is optional.

- Don't try to use `synchronous function` because it blocks the main thread, and it doesn't offload the task to libuv it blocks the main thread till the result comes back.

- synchronous function take callback function because there is no point of using callback in synchronous function.

Example 1:

```js
const https = require("https");
const fs = require("fs");

console.log("Hello World");

var a = 234234;
var b = 293847;

fs.readFileSync("./file.txt", "utf8"); // there is no callback because it's synchronous function
console.log("This will run after read file Sync");

setTimeout(() => {
  console.log("setTimeout called after 5 sec");
}, 5000);

https.get("https://dummyjson.com/products/1", (res) => {
  console.log("Fetched data successfully");
});
fs.readFile("./file.txt", "utf8", (err, data) => {
  console.log("File data:", data);
});

function multiply(a, b) {
  return a * b;
}

var c = multiply(12, 5);
console.log("Multiplication result is:", c);
// Output

/*
  Hello World
  This will run after read file Sync
  Multiplication result is: 60
  File data: This is a dummy File data.
  Fetched data successfully
  setTimeout called after 5 sec
*/
```

Example 2:

```js
const crypto = require("node:crypto");

console.log("Hello World");

var a = 234234;
var b = 293847;
// sync function which will not offload to libuv
crypto.pbkdf2Sync("Password", "salt", 5000000, 50, "sha512");
console.log("First key is generated");

// async function which will offload to libuv
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
  console.log("Second Key is generated");
});

function multiply(a, b) {
  return a * b;
}

var c = multiply(12, 5);
console.log("Multiplication result is:", c);

/*
Hello World
First key is generated
Multiplication result is: 60
Second Key is generated
*/
```

Example 3: (setTimeout)

```js
console.log("Hello World");

var a = 234234;
var b = 293847;
// This callback only pushed to call stack in v8 once callstack is empty
setTimeout(() => {
  console.log("call me asap");
}, 0); // trust issue with setTimeout

setTimeout(() => {
  console.log("call me after 3 sec");
}, 0);

function multiply(a, b) {
  return a * b;
}

var c = multiply(12, 5);
console.log("Multiplication result is:", c);

/*
Hello World
Multiplication result is: 60
call me asap
call me after 3 sec
*/
```

#### Deep dive into v8 JS Engine

Q: What are the steps runs when we give the code to the V8 engine.

- `Parsing`
  - First step of `parsing` is `Lexical analysis` or `tokenization`: Here the code we given is broken down into `tokens` (What is tokens: suppose we have given var a =10; here var can be on token a can be other token, = can be other token and so on..).
    `code => tokens`
  - `Syntax analysis` or `parsing`: In this steps broken down token are converted into `AST(Abstract syntax tree)`. To check the AST of code there is famous website to visualize it(`https://astexplorer.net/`)
    - `Syntax Error`: When our code does not able to generate the AST then it gives syntax error.

Q: How many types of languages are there and what are differences are there ?

- `Interpreted:`
  - In this step code is read by line by line.
  - Fast initially execution.
  - interpreter is use to interpret line by line code
- `Compiled:`

  - In this step `whole code` is compiled first and then convert `high level` code to `machine code`.
  - initially heavy but executed fast.
  - compilers is use to compile the the code.

- Javascript is a mixing of both interpreted and compiled language, It uses JIT(just in time) compilation process.

- V8 engine has interpreter that is known as ignition interpreter.
- V8 engine has compiler that is know as turbofan compiler.
- V8 engine has garbage collector that is known as `orinoco` and more there oil pan scavenger mcompact.

When we give the code AST is built -> ignition interpreter(converts the code in byte code) -> Execution

- Also ignition interpreter during interpreted the code it recognizes the code which is mostly reusable and it gives that piece code to `turbofan` compiler and that portion of code is known as `hot code`.
- Now the `turbofan` compiler converts the code into `machine code`.

![alt text](image-2.png)

- ignition interpreter give the reusable code to turbofan compiler and that process is known as `optimization`.

![alt text](image-3.png)

Above Process is known as JIT !

### Home work to Read more about `inline caching` and `copy elision` - Completed

#### Inline caching:

`Inline caching` is a technique used by JavaScript engines like V8 (which powers Node.js) to speed up property access and function calls.

7 Tips for Optimizing Node.js with `Inline Caching`:

1: Use Consistent Object Shapes

```js
// Bad Example:
function createUser(name, age) {
  let user = {};
  user.name = name;
  user.age = age;
  return user;
}
// Good Example:
function createUser(name, age) {
  return { name, age }; // Properties are assigned at once
}
```

2: Avoid Deleting Object Properties

```js
// Bad Example:
let user = { name: "Alice", age: 25 };
delete user.age; // De-optimizes object shape

// Good Example:
user.age = null; // Keeps the shape intact
```

3: Use Monomorphic Function Calls

V8 optimizes function calls when they always receive the same type of arguments. If a function is called with different argument types, it becomes polymorphic, which degrades inline caching efficiency.

```js
// Bad Example:
function getUserAge(user) {
  return user.age;
}

getUserAge({ name: "Alice", age: 25 });
getUserAge({ name: "Bob", birthYear: 1995 }); // Different object shape -> de-optimization

// Good Example:
function getUserAge(user) {
  return user.age;
}

const user1 = { name: "Alice", age: 25 };
const user2 = { name: "Bob", age: 30 };

getUserAge(user1);
getUserAge(user2); // Both have the same shape -> inline caching works
```

4: Initialize Object Properties in the Constructor

When using constructor functions or classes, always initialize all expected properties at object creation time.

```js
// Bad Example:
class User {
  constructor(name) {
    this.name = name;
  }
}
let user = new User("Alice");
user.age = 25; // Adding a property later changes the hidden class

// Good Example:
class User {
  constructor(name, age = null) {
    this.name = name;
    this.age = age; // Initialize all properties upfront
  }
}
```

5: Avoid Using `delete` and `Object.assign()` on Objects Dynamically

We’ve covered why delete is bad, but another sneaky way to break inline caching is dynamically merging objects with `Object.assign()`, especially when merging objects with different shapes.

```js
// Bad Example:
let user = { name: "Alice", age: 25 };
Object.assign(user, { country: "USA" }); // Adds new properties -> shape change

// Good Example:
let user = { name: "Alice", age: 25, country: null };
user.country = "USA"; // Keeps object shape intact
```

6: Keep Arrays Homogeneous

Inline caching also applies to arrays. Mixing different types in an array can degrade performance.

```js
// Bad Example:
let items = [1, "hello", true, { id: 1 }]; // Mixed types - de-optimization

// Good Example:
let numbers = [1, 2, 3, 4, 5]; // All numbers - optimized access
```

7: Use Map Instead of Object for Dynamic Key-Value Storage

```js
// Bad Example:
let userRoles = {};
userRoles["Alice"] = "admin";
userRoles["Bob"] = "editor";

// Good Example:
let userRoles = new Map();
userRoles.set("Alice", "admin");
userRoles.set("Bob", "editor");
```

#### copy elision

`Copy elision` is an `optimization` where the V8 JavaScript engine skips unnecessary copying of objects or arrays. Instead of creating new copies of objects, it reuses the existing ones to save time and memory

```js
function createObject() {
  let obj = { a: 10, b: 20 };
  return obj; // No copy, same reference is returned.
}

let newObj = createObject(); // newObj gets the reference to obj.
newObj.a = 30; // Modifying the same object.

console.log(newObj); // Output: { a: 30, b: 20 }
/**
 * When we return obj from the createObject function, the engine doesn't create a copy. Instead, it just returns a reference to the original object.

* newObj is now just pointing to the same object as obj inside the function.

* When we change newObj.a = 30, we are modifying the same object that obj inside the function was referring to.
*/
```

Note: this kind of optimization is handled automatically by V8, and most of the time, developers won't notice it happening.

![alt text](image-4.png)

Above architecture taken the reference from V8 engine for other js Engine it can be different, but in nut shell each engine use the same thing like they use interpreter, compiler and so on..

For more details about V8 engine Read this documentation(https://v8.dev/blog).

# Episode-09 | libuv & Event Loop

![alt text](image-5.png)

- In the above screenshot, it is describing how the libuv is handling the asynchronous call, as we know js engine is `synchronous` single threaded language it executes the code line by line when it sees any `asynchronous` call then it offloads to the libuv, and it's now libuv works to get the data or read the file from OS and so on and once callstack is empty then pass the callback function into the `callstack`.

- There is an `event-loop` inside the `libuv` which role is to keep checking `callstack` is empty or not, if it finds out the `callstack` is empty then it pass the callback to the callstack.

#### Event-loop: To be continue

![alt text](image-6.png)

There are multiple phases inside the event loop but there are 4 major phases.

- `timer:` First phase is timer where all the `setTimeout` and `setInterval` will be executed.
- `poll`: I/O callbacks like incoming connection, data, fs, crypto, http.get
- `check:` Third phase like setImmediate
- `close:` this is the last phase where mostly we do the cleanup and closing, like `socket.on("close")`.

All the above operation will wait inside the `callback queue` and `Event loop` keeps checking `callstack` and if it finds out the `callstack` is empty then it pick up something from `callback queue` and put inside the `callstack`.

`NOTE`: If we see inside the above diagram there is another inner cycle marked with blue and that cycle runs before each of the outer four steps, it's a kind of priority cycle which should be run before every phase os event loop.

![alt text](image-7.png)

`Example 1: `

```js
process.nextTick(cb);
Promise.resolve(cb);
setTimeout(cb);
setImmediate(cb);
fs.readFile("./file.txt", cb);
http.get("url", cb);
```

`In the above example how event loop runs` -> first inner cycle runs and it check for `process.nextTick` it finds out and executed it then it goes to `Promise callbacks` and it find out `Promise.resolve` and executed it then it goes to timer phase then executed `setTimeout` then again `inner cycle` runs and it did not find out anything then `event loop` goes to `poll phase` where `fs.readFile` and `http.get` executed then again runs the `inner loop` before `check phase` and then goes inside the `check phase` and executed the `setImmediate` and this process will continue.

`Example 2:`

![alt text](image-8.png)

```js
setImmediate(() => console.log("setImmediate"));

fs.readFile("./file.txt", "utf8", () => {
  console.log("File reading CB");
});

setTimeout(() => console.log("Timer expired"), 0);

function printA() {
  console.log("a = ", a);
}
printA();
console.log("Last line of file");
```

`NOTE` in above example -> in poll phase fs.readfile is still not completed till the time event loop checks the poll phase and prints the setImmediate before the poll phase

`NOTE:` When the event loop is idle then it waits at poll phase, ideal means if there is nothing to execute in callstack and there is nothing in callback queue, that time is ideal for event loop.

Like in above example event loop was ideal before `fs.readFile` because it takes time to read the file and that time callstack and callback queue was empty.

Example 3:

```js
setImmediate(() => console.log('setImmediate'))

setTimeout(() => console.log('Timer expired'), 0);

Promise.resolve('Promise').then((res) => console.log(res))

fs.readFile('./file.txt', 'utf8', () => {
    setTimeout(() => console.log('2nd Timer'), 0);
    process.nextTick(() => console.log('2nd nextTick'))
    setImmediate(() => console.log('2nd setImmediate'))
    console.log('File reading CB')
})
process.nextTick(() => console.log('nextTick'))
console.log('Last line of file')

/** Output
* Last line of file
* nextTick
* Promise
* Timer expired
* setImmediate
* File reading CB
* 2nd nextTick
* 2nd setImmediate
* 2nd Timer
* /
```

`Example 4:`

```js
setImmediate(() => console.log("setImmediate"));

setTimeout(() => console.log("Timer expired"), 0);

Promise.resolve("Promise").then((res) => console.log(res));

fs.readFile("./file.txt", "utf8", () => {
  console.log("File reading CB");
});
process.nextTick(() => {
  process.nextTick(() => {
    process.nextTick(() => {
      console.log("Inner nextTick");
    });
  });
  console.log("nextTick");
});
console.log("Last line of file");
/**
 * Last line of file
 * nextTick
 * Inner nextTick
 * Promise
 * Timer expired
 * setImmediate
 * File reading CB
 */
```

`NOTE:` So as we can see in the 4th example nextTick is recursively has called on inside another so first it complete all nextTick then it move to next phase.

Example 4:

```js
setImmediate(() => console.log('setImmediate'))

setTimeout(() => console.log('Timer expired'), 0);

Promise.resolve('Promise').then((res) => {
    process.nextTick(() => {
        console.log('nextTick 3')
    })
    console.log(res)
})

fs.readFile('./file.txt', 'utf8', () => {
    console.log('File reading CB')
    process.nextTick(() => {
        console.log('nextTick 4')
    })
})
process.nextTick(() => {
    process.nextTick(() => {
        process.nextTick(() => {
            console.log('nextTick 2')
        })
    });
    console.log('nextTick 1')
})
console.log('Last line of file')
/**
 * Last line of file
 * nextTick 1
 * nextTick 2
 * Promise
 * nextTick 3
 * Timer expired
 * setImmediate
 * File reading CB
 * nextTick 4
 * /
```

# Episode-10 | Thread pool in libuv

#### What is `tick`:

One cycle of the event loop is known as `tick`

#### `Home work 1` Read about event loop from official doc(Note there are two more(1: `Pending callbacks`, 2: `idle, prepare`) phase on event loop please check documentation) -> pending

#### `Home work 2` Read the event loop from libuv documentation as well.

![alt text](image-9.png)

Event loop code:
![alt text](image-10.png)

- What is `thread`:
- In uv_thread_pool_size by default there are four threads .

#### When libuv uses the thread pool

Ans: `fs`, `dns.lookup`, `crypto`, `crypto.pbkdf2`, `user specified input`

![alt text](image-11.png)

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

![alt text](image-12.png)

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

![alt text](image-13.png)

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

![alt text](image-17.png)
![alt text](image-16.png)

### DNS Servers: The Internet’s Phonebook

- You type namastedev.com → Browser queries a DNS server.
- DNS maps namaste.com → IP (e.g., 142.250.190.46).

`Analogy`

- `Domain` = Verbal address ("Akshay’s house, Dehradun").
- `IP` = GPS coordinates (exact location).

## Multiple Servers on One Machine

![alt text](image-15.png)

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

![alt text](image-14.png)

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

# Episode-12 | Databases - SQL & NoSQL

## What is Databases ?

A database is an `organized (or structured)` collection of data.
`Note`: The key word here is `organized` — data is stored in a structured way to allow efficient operations like insertion, retrieval, and modification.

## Database vs. Database Management System (DBMS).

`Database (DB):`

- A structured storage system where data is kept.
- Example: A file containing customer records.

`Database Management System (DBMS):`

- A software layer that interacts with End users, Applications, The database itself.
- It manages data operations (insert, update, delete, query).
- Example: MySQL, MongoDB, PostgreSQL.

## Types of Databases

There are multiple types of databases, each serving different use cases.

![alt text](image-18.png)

`Relational Databases (SQL Databases)`

- Store data in `tables (rows & columns)` with strict schemas.
- Use `SQL (Structured Query Language)` for operations.

`Examples:`

- MySQL (Most widely used)
- PostgreSQL (Postgres) (Advanced features)
- Amazon RDS (Cloud-based relational DB)

`NoSQL Databases`

- `Non-tabular`, flexible schema.

`Examples:`

- `Document DB (e.g., MongoDB)` → Stores JSON-like documents.
- `Key-Value DB (e.g., Redis)` → Fast in-memory caching.
- `Graph DB (e.g., Neo4j)` → For relationship-heavy data.
- `Time-Series DB (e.g., InfluxDB)` → For time-based data (IoT, logs).

`Other Types:`

- `In-Memory DB (Redis)` → Used for caching (fast access).
- `Distributed SQL (CockroachDB)` → Scalable across servers.
- `Hierarchical DB (IBM IMS)` → Tree-like structure.
- `Multi-Model DB` → Supports multiple data models.

Still there are more!

`Most Common in Industry:`

- Relational (MySQL, PostgreSQL) → Traditional apps.
- NoSQL (MongoDB) → Modern web apps (MEAN/MERN stack).
- Redis → Caching for performance optimization.

## Introduction to NoSQL Databases and MongoDB

### Types of NoSQL Databases

`NoSQL` databases are categorized into `four` major types

1: `Document Database`

Stores data in JSON-like documents (e.g., MongoDB).

2: `Key-Value Database`

- Stores data as key-value pairs (e.g., Redis, DynamoDB).

3: `Graph Database`

- Stores data in nodes and edges (e.g., Neo4j, which uses Cypher Query Language).

4: `Wide-Column Database`

- Stores data in columns rather than rows (e.g., Cassandra, HBase).

Additionally, some databases are `multi-model`, meaning they combine multiple NoSQL database types.

## What is NoSQL?

- `NoSQL` stands for `Not Only SQL`, emphasizing that these databases are more than just `relational databases`.

- It emerged in the `late 2000s` as an alternative to traditional `Relational Database Management Systems (RDBMS)`.

- Unlike RDBMS (which has been dominant since the 1970s), NoSQL databases are designed for `flexibility`, `scalability`, and `unstructured` data.

## MongoDB: A Document Database

`History of MongoDB`

- Developed by `10gen (later renamed MongoDB Inc.)` in 2009.
- The name `Mongo` comes from the word `humongous`, indicating its ability to handle large-scale data.
- `MongoDB` gained popularity alongside `Node.js` because they work seamlessly together (JSON-based data fits well with JavaScript).

## Why MongoDB is Popular?

- `Flexible Schema`: No rigid structure; fields can be added/removed easily.
- `Developer-Friendly`: Uses `JSON-like documents`, making it easy to integrate with JavaScript/Node.js.
- `Scalability`: Supports `horizontal scaling `(distributed databases).
- `Performance`: Optimized for `high-speed read/write operations`.

## RDBMS vs. NoSQL (MongoDB)

| **RDBMS(e.g., MySQL)**                         | **NoSQL (MongoDB)**                                           |
| ---------------------------------------------- | ------------------------------------------------------------- |
| Tables (Rows & Columns)                        | Collections (Documents & Fields)                              |
| Structured Data                                | Unstructured Data                                             |
| Fixed (Predefined)                             | Flexible (Dynamic)                                            |
| SQL (Structured Query Language)                | MongoDB Query Language (MQL) / Other NoSQL-specific languages |
| Joins & Relations -> Uses Foreign Keys & Joins | No Joins (Nested documents instead)                           |
| Read-heavy apps, transaction workloads         | Real-time apps, Big Data, distributed computing               |
| Ex: Banking apps                               | Ex: Real time analysis, social media                          |

## How Data is Stored?

![alt text](image-19.png)

`RDBMS` Example (MySQL):

`Tables`: Users (ID, FirstName, LastName, Phone, City)

`Relations`: Separate Hobbies table linked via UserID.

`Normalization`: Data is split into multiple tables to avoid redundancy.

`MongoDB Example`

- `Collections`: users
- `Documents`:

```js
{
  "_id": 1,
  "firstName": "Leslie",
  "lastName": "Yepp",
  "phone": "1234567890",
  "city": "Pune",
  "hobbies": ["Scrapbooking", "Eating Waffles", "Working"]
}
// id, firstName and so on these are fields
```

- `No Joins Needed`: All related data is stored in a single document.

## When to Use Which?

- Use `RDBMS` if:

  - You need `ACID transactions` (e.g., banking systems).
  - Data is highly structured with fixed schemas.

- Use `NoSQL` (MongoDB) if:
  - You need flexibility (evolving data models).
  - You’re building `real-time apps, analytics, or social media platforms`.
  - You need `horizontal scaling` (distributed systems).

## Note: `ACID` is acronym of

- `Atomicity`(Transactions are all-or-nothing)

  Example: If Step 1 (deducting money) succeeds but Step 2 (adding money) fails, the entire transaction rolls back.

- `Consistency`(Ensures data remains valid before & after a transaction)

  Example: A bank transfer must maintain total balance (₹1000 moved, not lost).

- `Isolation`(Prevents concurrent transactions from interfering)

  Example: If two people transfer money from the same account, one must wait.

- `Durability`(Once committed, changes persist even after crashes)

  Example: After transfer, data is saved permanently (not lost if the server restarts).

For more details read the [documentation of mongodb](https://www.mongodb.com/resources/basics/databases/acid-transactions#:~:text=transactions%20are%20required.-,ACID%20transactions,the%20event%20of%20unexpected%20errors.)

# Episode-13 | Creating a database & mongodb

## Introduction to MongoDB

`MongoDB` is a document-oriented NoSQL database that stores data in collections as documents (instead of tables, rows, and columns in SQL databases). In this guide, we'll learn how to:

- Connect Node.js to MongoDB
- Push data into the database
- Fetch data from the database
- Write queries

## Setting Up MongoDB

### Two Ways to Use MongoDB

- #### Self-Managed (Local Installation)
  - Download and install MongoDB on your local machine
  - Available for Windows, Linux, and MacOS
  - You manage everything (backups, scaling, availability)
- #### Managed by MongoDB (Atlas)
  - MongoDB hosts your database on their cloud servers
  - They handle maintenance, backups, and scaling
  - Free tier available (perfect for learning)

NOTE: we'll use the second approach

## Creating a MongoDB Atlas Account

- Go to mongodb.com
- Click "Try Free" (Atlas is MongoDB's cloud service)
- Sign up with Google, email, or other options
- Complete the survey (select options that match your needs)

## Creating a Cluster

- Choose the M0 Free Tier cluster (free forever)

  - Ideal for learning and small projects
  - Can be upgraded later if needed

- Select a cloud provider (AWS, Google Cloud, Azure)
- Choose a region (pick one closest to your users)

- Create a username and password (save these securely)

- Wait for cluster deployment (takes a few minutes)

## Getting the Connection String

- In Atlas dashboard, click "Connect" on your cluster

- Choose "Drivers" connection method

- Copy the connection string (URI)

  - Looks like: mongodb+srv://<username>:<password>@cluster-name.mongodb.net/

- Replace <password> with your actual password

## MongoDB Compass - Visual Database Interface

### What is MongoDB Compass?

MongoDB Compass is a graphical user interface (GUI) that allows you to:

- Visually explore your MongoDB data
- Run queries
- Analyze document structure
- Interact with your data without writing commands

### Connecting to Your Database

- Open MongoDB Compass

- Click "New Connection"

- Paste your connection string (same one used in Node.js code)

- Format: mongodb+srv://<username>:<password>@cluster-name.mongodb.net/

- Click "Connect"

### Creating a Database via Compass

- Click the "+" button next to "Databases"
- Enter:

  - Database Name (e.g., "hello-world")

  - Collection Name (e.g., "users")

### Adding Documents

- Select your collection

- Click "Insert Document"

- Add fields (similar to JSON):

```json
{
  "firstName": "Ranjan",
  "lastName": "Rai",
  "city": "Bangalore",
  "phone": "4321567890"
}
```

- MongoDB automatically adds a unique \_id field

### Node.js MongoDB Driver

#### About npm (Node Package Manager)

- Central repository for JavaScript packages

- Not officially "Node Package Manager" but functions as one

- Contains thousands of libraries/modules for various functionalities

#### Installing the MongoDB Driver

```js
npm install mongodb
# or shorthand:
npm i mongodb
```

#### Important Files Created

- `package.json` - Lists project dependencies

- `package-lock.json` - Locks dependency versions

- `node_modules/` - Contains all installed packages

`Note`: Add a `.gitignore` file with node_modules/, This prevents committing the large node_modules folder to version control.

### Practical Implementation

```js
const { MongoClient } = require("mongodb");

// connection URL
const URI = "mongodb+srv://root:admin@namastenode.eryuh5w.mongodb.net/";
const client = new MongoClient(URI);

// Database Name
const dbName = "hello-world";

async function main() {
  await client.connect();
  console.log("Connected to server successfully");

  const db = client.db(dbName);
  const collection = db.collection("Users");
  console.log("COLLECTION PROPERTIES", collection.aggregate());
  /**
   * Insert the documents
   */

  // Inserting single document
  //   const insertSingleResult = await collection.insertOne({
  //     firstName: "Ranjan",
  //     lastName: "Rai",
  //     userName: "Ranjan Rai",
  //     country: "India",
  //     city: "Bangalore",
  //     age: 33,
  //     phone: "2344678901",
  //   });
  // Inserting multiple documents
  //   const insertMultipleDocuments = await collection.insertMany([
  //     {
  //       firstName: "Ranjan",
  //       lastName: "Rai",
  //       userName: "Ranjan Rai",
  //       country: "India",
  //       city: "Bangalore",
  //       age: 33,
  //       phone: "1231678443",
  //     },
  //     {
  //       firstName: "Shyam",
  //       lastName: "Rai",
  //       userName: "Shyam Rai",
  //       country: "India",
  //       city: "Delhi",
  //       age: 27,
  //       phone: "8142078411",
  //     },
  //   ]);

  /**
   * Finding the documents
   */

  // Find all documents
  const findAllDocs = await collection.find({}).toArray();
  //   console.log("findAllDocs", findAllDocs);

  // Find with filter
  const ranjan = await collection.findOne({ firstName: "Ranjan" });

  // Find with complex filter
  const delhiUsers = await collection
    .find({
      city: "Delhi",
      age: { $gt: 25 }, // Age greater than 25
    })
    .toArray();
  //   console.log("delhiUsers", delhiUsers);
  /**
   * update the documents
   */
  // Updating one document
  const updateOneDocument = await collection.updateOne(
    {
      firstName: "Ranjan",
    },
    { $set: { age: 32 } }
  );
  // updating multiple document
  const updateMultipleDocument = await collection.updateMany(
    {
      firstName: "Ranjan",
    },
    { $set: { age: 32 } }
  );
  /**
   * Deleting The Documents
   */
  // Deleting one document
  const deleteOneDocument = await collection.deleteOne({
    firstName: "Ranjan",
  });
  // Deleting many document
  const deleteManyDocument = await collection.deleteOne({
    firstName: "Ranjan",
  });
  /**
   * Count the documents
   */
  const countDocuments = await collection.countDocuments();
  //   console.log("Total documents:", countDocuments);
  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
```
### `Cursor` vs `Array`
- `find()` returns a cursor (not documents directly)
- Convert to `array` with `.toArray()`
- Cursors enable method chaining and efficient memory usage

```js
// Returns cursor
const cursor = collection.find({});

// Convert to array
const documents = await cursor.toArray();

// Method chaining example
const count = await collection.find({ city: "Mumbai" }).count();
```

