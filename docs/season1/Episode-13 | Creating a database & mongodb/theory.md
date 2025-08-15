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
