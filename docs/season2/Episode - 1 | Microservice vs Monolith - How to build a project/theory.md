# Episode - 1 | Microservice vs Monolith - How to build a project

## Introduction

This guide explains how software projects are built in industry, covering:

- Software Development Life Cycle (SDLC)
- Team roles and responsibilities
- Monolithic vs Microservices architecture

## 1. Software Development Life Cycle (Waterfall Model)

### Phases:

| Phase                        | Activities                                | Responsible Team               |
| ---------------------------- | ----------------------------------------- | ------------------------------ |
| **Requirement Gathering**    | Define features, user flows, UI mockups   | Product Manager + Designers    |
| **Design**                   | System architecture, tech stack decisions | Senior Engineers/Tech Leads    |
| **Development**              | Writing code, implementation              | Developers (SD1, SD2, Interns) |
| **Testing**                  | Unit tests, integration tests             | Developers + QA Team           |
| **Deployment & Maintenance** | Production release, updates               | DevOps + Developers            |

### Key Insights:

- **Product Managers (PMs)** define what to build (not developers!).
- **Designers** create UI mockups before coding starts.
- **Developers** write code + unit tests (testing is part of development!).
- **Deployment** is handled by DevOps or senior developers.

## 2. Architecture: Monolithic vs Microservices

### Monolithic Architecture

**Single, large codebase** containing:

- Backend
- Frontend
- Database
- All business logic

**Pros:**

- Simpler initial development
- Easier debugging
- Good for small teams

**Cons:**

- Hard to scale
- Slower deployments
- Difficult for large teams

### Microservices Architecture

**Multiple independent services**, each handling one function:
**Pros:**

- Highly scalable
- Independent deployments
- Fault isolation

**Cons:**

- Complex to manage
- Debugging challenges
- Needs DevOps expertise

## 3. DevTinder Implementation Approach

**Tech Stack:**

- Backend: Node.js + Express
- Database: MongoDB
- Frontend: React (minimal focus)
- Deployment: CI/CD pipelines

**Why Microservices?**

- Better reflects industry practices
- Easier to add features later
- Good learning experience

## Microservices vs Monolithic Architecture: Industry Insights

## Overview

This guide compares monolithic and microservices architectures based on real-world industry experience, particularly for junior engineers and students transitioning to professional development.

![alt text](/assets/season2/image1.png)

## Key Comparison Table

| Factor              | Monolithic Architecture                   | Microservices Architecture            |
| ------------------- | ----------------------------------------- | ------------------------------------- |
| **Dev Speed**       | Slower (single codebase, many developers) | Faster (parallel development)         |
| **Code Repo**       | Single large repository                   | Multiple independent repositories     |
| **Scalability**     | Challenging at large scale                | Easier (scale services independently) |
| **Deployment**      | Whole app redeployed for any change       | Independent service deployments       |
| **Tech Stack**      | Restricted to one stack                   | Freedom to choose per service         |
| **Infra Cost**      | Lower                                     | Slightly higher                       |
| **Complexity**      | High for large projects                   | Easier to manage at scale             |
| **Fault Isolation** | Whole app can crash                       | Only affected service fails           |
| **Testing**         | Easier end-to-end testing                 | Harder distributed testing            |
| **Ownership**       | Centralized                               | Distributed by team                   |
| **Maintenance**     | Harder                                    | Easier per service                    |
| **Debugging**       | Slightly easier                           | Can be challenging                    |

## Detailed Insights

### Development Experience

- **Microservices win** for development speed and parallel work
- Example: Frontend and backend teams can work independently
- In monoliths, code reviews and merges become bottlenecks

### Scaling Challenges

- **Monoliths become unwieldy** as codebase grows (Uber's early challenges)
- **Microservices allow** targeted scaling (e.g., just scale analytics service)

### Deployment Differences

- **Monolith pain point**: Must redeploy entire app for small changes
- **Microservices advantage**: Deploy just the changed service
- **Versioning challenge**: Requires good coordination between teams

### Real-World Example: Namaste Dev

Current microservices:

1. **Student Web** (Next.js)
2. **Admin Dashboard** (React)
3. **Backend Service** (Node.js)
4. **Mobile App** (React Native - planned)

## DevTinder Implementation Approach

### Architecture Choice

We'll build Devinder with **2 microservices**:

1. **Frontend Service**: React application
2. **Backend Service**: Node.js application

### Communication

- Frontend and backend will communicate via **REST APIs**
- Example flow:

Frontend (devTinder.com/profile) → API Call → Backend (/get-profile) → Database → Response → UI

## Key Takeaways for Junior Engineers

1. **Industry Trend**: Most companies are moving to microservices
2. **Start Simple**: Begin with few services, expand as needed
3. **Team Structure**: Microservices enable focused team ownership
4. **Practical Tip**: Maintain API compatibility between services

## Action Items

1. **For Students**:

- Try building both architectures in small projects
- Research how major companies transitioned (e.g., Netflix, Uber)

2. **For DevTinder**:

- We'll start with clean separation between frontend/backend
- Focus on Node.js backend implementation
- Build industry-standard communication patterns

> "Microservices give you flexibility but require discipline in coordination." - Industry Insight
