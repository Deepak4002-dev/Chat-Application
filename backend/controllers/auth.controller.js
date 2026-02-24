import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import {
  accessTokenCookieOptions,
  clearCookieOptions,
  refreshTokenCookieOptions,
} from "../config/cookieOptions.js";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET_KEY } from "../config/constants.js";

const signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("User already exists", 409);

  const createdUser = new User({
    username,
    email,
    password,
  });

  const user = await createdUser.save();

  user.password = undefined;
  user.refreshToken = undefined;

  res.status(200).json({
    status: "success",
    data: user,
    message: "User Created Successfully",
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser) {
    throw new AppError("User Not Found", 404);
  }

  const result = await existingUser.matchPassword(password);
  if (!result) {
    throw new AppError("Incorrect email or password", 401);
  }

  const accessToken = generateAccessToken({
    _id: existingUser._id,
    email: existingUser.email,
    role: existingUser.role,
  });

  const refreshToken = generateRefreshToken({
    _id: existingUser._id,
    email: existingUser.email,
    role: existingUser.role,
  });

  // ✅ Set BOTH cookies
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  existingUser.refreshToken = refreshToken;
  existingUser.isOnline = true;
  const user = await existingUser.save({ validateBeforeSave: false });

  user.password = undefined;
  user.refreshToken = undefined;
  user.email = undefined;

  res.status(200).json({
    status: "success",
    message: "Your are Logged in",
    data: user,
  });
});

const refresh = catchAsync(async (req, res, next) => {
  console.log("🔄 [REFRESH] Token refresh requested at", new Date().toISOString());
  let oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    throw new AppError("Refresh token not found. Please login", 400);
  }

  let decoded;

  try {
    decoded = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET_KEY);
  } catch (error) {
    throw new AppError("Invaild or Expired token. Please login !!!", 401);
  }

  const user = await User.findOne({ email: decoded.email }).select(
    "+refreshToken",
  );
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (!(user.refreshToken === oldRefreshToken)) {
    throw new AppError("Invalid token.", 401);
  }

  const newAccessToken = generateAccessToken({
    _id: user._id,
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = generateRefreshToken({
    _id: user._id,
    email: user.email,
    role: user.role,
  });

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

   console.log("✅ [REFRESH] New tokens issued for user:", user.email);

  res.status(200).json({
    status: "success",
    message: "Token refreshed successfully",
  });

});

const logout = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null, isOnline:false });
  res.clearCookie("accessToken", clearCookieOptions);
  res.clearCookie("refreshToken", {
    ...clearCookieOptions,
    path: "/api/v1/auth/refresh",
  });

  res.status(200).json({
   status:"success",
   message:"Logout successfully"
  })
});


const getMe = catchAsync(async (req,res,next)=>{ 
  const user = await User.findById(req.user._id).select('-refreshToken -password -email');
  if(!user)
  {
    throw new AppError("User not found",404);
  }

  res.status(200).json({
    status:"success",
    data:user
  })
})

export { signup, login,logout,refresh, getMe };
