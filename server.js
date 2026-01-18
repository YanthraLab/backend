require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const createAdminIfNotExists = require("./src/services/adminBootsrap.service");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();
  await createAdminIfNotExists();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

