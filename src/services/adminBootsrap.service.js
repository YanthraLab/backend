const User = require("../models/User.model");
const { hashPassword, comparePassword } = require("../utils/hash");

const createAdminIfNotExists = async () => {
  try {
    const adminExists = await User.exists({ role: "admin" });

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (adminExists) {
      console.log("✅ Admin account already exists");

      const adminUser = await User.findOne({ role: "admin" });
      const isPasswordMatch = await comparePassword(password, adminUser.password);

      if (!isPasswordMatch) {
        const hashedPassword = await hashPassword(password);
        await User.updateOne({ role: "admin" }, { password: hashedPassword });
        console.log("🔄 Admin password updated to match .env");
      }
      return;
    }

    if (!email || !password) {
      console.warn("⚠️ Admin credentials not set in .env");
      return;
    }

    const hashedPassword = await hashPassword(password);

    await User.create({
      email,
      password: hashedPassword,
      role: "admin",
      name: "Default Admin",
    });

    console.log("🚀 Default admin account created");
  } catch (error) {
    console.error("❌ Error in admin bootstrap:", error.message);
    console.error("Full error:", error);
    throw error;
  }
};

module.exports = createAdminIfNotExists;
