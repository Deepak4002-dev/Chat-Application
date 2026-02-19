import { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from "../config/constants.js";
import AppError from "../utils/AppError.js";
import jwt from 'jsonwebtoken';

// Authentication - Verify user identity
const authenticate = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new AppError("You are not logged in. Please login!", 401);
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token expired", 401);
    }
    throw new AppError("Invalid token", 401);
  }
};

// Authorization - Check user role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("You do not have permission to perform this action", 403);
    }
    next();
  };
};

export { authenticate, authorize };