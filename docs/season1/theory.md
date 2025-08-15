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
  ![alt text](/assets/season1/libuv-diagram.jpeg)

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

![alt text](/assets/season1/image-2.png)

- ignition interpreter give the reusable code to turbofan compiler and that process is known as `optimization`.

![alt text](/assets/season1/image-3.png)

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

![alt text](/assets/season1/image-4.png)

Above architecture taken the reference from V8 engine for other js Engine it can be different, but in nut shell each engine use the same thing like they use interpreter, compiler and so on..

For more details about V8 engine Read this documentation(https://v8.dev/blog).

