require("dotenv").config();
const app = require("./src/app");
const { connectDB } = require("./src/config/supabase");
const createAdminIfNotExists = require("./src/services/adminBootsrap.service");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    console.log('🔄 Starting server...');
    
    await connectDB();
    await createAdminIfNotExists();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

startServer().catch(err => {
  console.error('❌ Unhandled error during startup:', err);
  process.exit(1);
});

