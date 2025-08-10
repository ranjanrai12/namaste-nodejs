const mongoose = require("mongoose");

const connectMongooseDB = async () => {
  return await mongoose.connect(process.env.MONGODB_URI);
};


module.exports = connectMongooseDB;

