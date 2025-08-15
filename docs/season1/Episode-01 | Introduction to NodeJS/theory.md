# Episode-01 | Introduction to NodeJS

## The Famous Quote

**Any application that can be written in JavaScript will eventually be written in JavaScript.**
— Jeff Atwood, around 2007 (before Node.js even existed)

At that time, it sounded ambitious.
Today, 17+ years later, JavaScript truly is everywhere — in browsers, servers, smartwatches, light bulbs, and even IoT devices.

## What is Node.js?

Node.js is a **JavaScript runtime** built on Chrome’s **V8 engine**, enabling JavaScript to **run outside the browser**

Nodejs has an `event-driven` architecture and capable of `asynchronous I/O` aka `Non blocking I/O`.

**Key POints**

- `JavaScript Runtime` – Environment where JavaScript code executes.
- `V8 Engine` – High-performance JavaScript engine from Google Chrome.
- `Cross-Platform` – Runs on Windows, macOS, Linux, and more.
- `Open-Source` – Maintained by the OpenJS Foundation.
- `Executes JS Outside the Browser` – Historically JS ran inside browsers only; Node.js allows running it on servers, devices, and more.

## Core Concepts to Remember

- **Event-Driven Architecture** – Actions trigger events, and handlers respond asynchronously.
- **Asynchronous I/O** – Operations don’t block other tasks while waiting for results.
- **Non-Blocking I/O** – Allows handling multiple requests efficiently without waiting for one to finish before starting another.

## History of Node.js

| Year            | Event                                                                                                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2009**        | **Node.js created** by _Ryan Dahl_. Initially used **SpiderMonkey** (Firefox’s JS engine), but switched to **V8** within 2 days.                                                                                          |
| **2009**        | **Joyent** (a cloud computing company) hired Ryan Dahl to work on Node.js full-time and funded development. Originally named **Web.js**, later renamed to **Node.js** to reflect broader capabilities beyond web servers. |
| **2010**        | **NPM (Node Package Manager)** created by _Isaac Schlueter_ (also from Joyent) to manage reusable packages/modules.                                                                                                       |
| **2011**        | **Windows support added** in collaboration between Joyent and Microsoft. Before this, Node.js only worked on macOS and Linux.                                                                                             |
| **2012**        | Ryan Dahl stepped down as project lead, handing control to Isaac Schlueter.                                                                                                                                               |
| **2014**        | A dispute about slow release cycles led _Fedor Indutny_ to fork Node.js into **io.js** — a faster-moving alternative.                                                                                                     |
| **2015 (Sept)** | **Node.js Foundation** formed. **io.js merged back** into Node.js under this foundation, unifying the community.                                                                                                          |
| **2019**        | Node.js Foundation merged with JS Foundation → **OpenJS Foundation** now maintains Node.js.                                                                                                                               |
| **Present**     | Node.js continues to evolve, with frequent updates to support modern JavaScript features and performance improvements.                                                                                                    |

## Why Node.js Was Created

- **Problem with Apache HTTP Server**: It used a blocking I/O model (one request could block others).

- **Goal**: Create a **non-blocking, event-driven server** that could handle many connections efficiently with fewer resources.

## The Role of the JavaScript Engine

- Every JavaScript environment (browser, server, IoT device) has a JS engine to execute code.

- **V8 (Google Chrome)** – Powers Node.js.

- **SpiderMonkey (Firefox)** – Initially used in Node.js prototype.

- **Fun Fact** – Without a JS engine, JavaScript code cannot run.

## NPM — The Game Changer

- **NPM** is the world’s largest software registry.

- Allows developers to publish and reuse modules (e.g., for date handling, image processing, server frameworks).

- Significantly boosted Node.js adoption.

## Why Node.js Is Still Popular After 15+ Years

- Event-driven, non-blocking architecture.

- Huge package ecosystem (NPM).

- Cross-platform support.

- Backed by a large open-source community.

- Continuous updates by the **OpenJS Foundation**.
