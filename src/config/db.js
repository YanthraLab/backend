const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL;

const connectDB = async () => {
  try {
    if (!dbUrl) {
      throw new Error("DB_URL is not defined in environment variables");
    }

    await mongoose.connect(dbUrl);

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
