// import {sum} from "./test.js";
// const sum  = require('./calculate/add')
// const { sum, multiply } = require('./calculate')
// sum(2,3)
// multiply(2, 4)
const https = require('https');
const fs = require('fs');
const crypto = require('node:crypto');

// console.log('Hello World')

var a  = 234234;
var b = 293847;

// fs.readFileSync('./file.txt', 'utf8');
// console.log('This will run after read file Sync')

// setTimeout(() => {
//     console.log('setTimeout called after 5 sec')
// }, 5000);

// https.get('https://dummyjson.com/products/1', (res) => {
//     console.log('Fetched data successfully')
// })
// fs.readFile('./file.txt', 'utf8', (err, data) => {
//     console.log("File data:", data)
// })

// function multiply(a, b) {
//     return a *b;
// }

// var c = multiply(12,5);
// console.log("Multiplication result is:",  c);
// crypto.pbkdf2Sync("Password", "salt", 5000000, 50, "sha512");
// console.log("First key is generated");

// crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
//     console.log("Second Key is generated")
// })

// function multiply(a, b) {
//     return a *b;
// }

// var c = multiply(12,5);
// console.log("Multiplication result is:",  c);

// This callback only pushed to call stack in v8 once callstack is empty 
// setTimeout(() => {
//     console.log("call me asap")
// }, 0); // trust issue with setTimeout

// setTimeout(() => {
//     console.log("call me after 3 sec")
// }, 0);

// function multiply(a, b) {
//     return a *b;
// }

// var c = multiply(12,5);
// console.log("Multiplication result is:",  c);

// setImmediate(() => console.log('setImmediate'))

// setTimeout(() => console.log('Timer expired'), 0);

// Promise.resolve('Promise').then((res) => {
//     process.nextTick(() => { 
//         console.log('nextTick 3')
//     })
//     console.log(res)
// })

// fs.readFile('./file.txt', 'utf8', () => {
//     console.log('File reading CB')
//     process.nextTick(() => { 
//         console.log('nextTick 4')
//     })
// })
// process.nextTick(() => {
//     process.nextTick(() => {
//         process.nextTick(() => { 
//             console.log('nextTick 2')
//         })
//     });
//     console.log('nextTick 1')
// })
// console.log('Last line of file')

/** output
 * Last line of file
 * nextTick 1
 * nextTick 2
 * Promise
 * nextTick 3
 * Timer expired
 * setImmediate
 * File reading CB
 * nextTick 4
 */
process.env.UV_THREADPOOL_SIZE = 8
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
    console.log("1: crypto.pdkdf2 done")
})
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
    console.log("2: crypto.pdkdf2 done")
})
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
    console.log("3: crypto.pdkdf2 done")
})
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
    console.log("4: crypto.pdkdf2 done")
})
crypto.pbkdf2("Password", "salt", 5000000, 50, "sha512", (err, key) => {
    console.log("5: crypto.pdkdf2 done")
})