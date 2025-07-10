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
    console.log("COLLECTION PROPERTIES", collection.aggregate())
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
