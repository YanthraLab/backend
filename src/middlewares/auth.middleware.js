const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

protect = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(new AppError("Unauthorized", 401));

  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    next();
  } catch {
    next(new AppError("Token expired or invalid", 401));
  }
};

exports.protect = protect;