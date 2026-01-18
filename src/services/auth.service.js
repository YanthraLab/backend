const User = require("../models/User.model");
const AppError = require("../utils/AppError");
const { comparePassword, hashPassword } = require("../utils/hash");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token");

const signup = async (userData) => {
  const { email, password, name, birthday, role } = userData;
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    birthday,
    role,
  });

  return newUser;
};

const login = async ({ email, password, rememberMe }) => {
  console.log("Auth Service - Login called with:", { email, rememberMe }); // Debugging line
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, rememberMe);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken, rememberMe };
};

const authService = { login, signup };

module.exports = {authService};
