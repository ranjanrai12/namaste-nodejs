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

![alt text](/assets/season1/image-18.png)

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

![alt text](/assets/season1/image-19.png)

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
