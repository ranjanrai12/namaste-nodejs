const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client.js");

const uploadToS3 = async (file, folder = "uploads") => {
  try {
    if (!file) {
      throw new Error("File is required for S3 upload");
    }

    const fileKey = `${folder}/${Date.now()}-${file.originalname}`;
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    throw err;
  }
};

module.exports = { uploadToS3 };
