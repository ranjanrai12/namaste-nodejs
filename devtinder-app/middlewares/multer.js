const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Store file in memory first to calculate hash
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
