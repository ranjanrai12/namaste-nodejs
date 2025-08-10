const mongoose = require("mongoose");

const connectMongooseDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};


module.exports = connectMongooseDB;

