# Episode-09 | libuv & Event Loop

![alt text](/assets/season1/image-5.png)

- In the above screenshot, it is describing how the libuv is handling the asynchronous call, as we know js engine is `synchronous` single threaded language it executes the code line by line when it sees any `asynchronous` call then it offloads to the libuv, and it's now libuv works to get the data or read the file from OS and so on and once callstack is empty then pass the callback function into the `callstack`.

- There is an `event-loop` inside the `libuv` which role is to keep checking `callstack` is empty or not, if it finds out the `callstack` is empty then it pass the callback to the callstack.

#### Event-loop: To be continue

![alt text](/assets/season1/image-6.png)

There are multiple phases inside the event loop but there are 4 major phases.

- `timer:` First phase is timer where all the `setTimeout` and `setInterval` will be executed.
- `poll`: I/O callbacks like incoming connection, data, fs, crypto, http.get
- `check:` Third phase like setImmediate
- `close:` this is the last phase where mostly we do the cleanup and closing, like `socket.on("close")`.

All the above operation will wait inside the `callback queue` and `Event loop` keeps checking `callstack` and if it finds out the `callstack` is empty then it pick up something from `callback queue` and put inside the `callstack`.

`NOTE`: If we see inside the above diagram there is another inner cycle marked with blue and that cycle runs before each of the outer four steps, it's a kind of priority cycle which should be run before every phase os event loop.

![alt text](/assets/season1/image-7.png)

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

![alt text](/assets/season1/image-8.png)

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
