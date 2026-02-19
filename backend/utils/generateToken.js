import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_EXPIRY,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRY,
} from "../config/constants.js";


const generateAccessToken = (payload)=>{
   const accessToken = jwt.sign(payload,JWT_ACCESS_SECRET_KEY,{expiresIn:JWT_ACCESS_EXPIRY})
   return accessToken;
}

const generateRefreshToken = (payload)=>{
    const refreshToken =jwt.sign(payload,JWT_REFRESH_SECRET_KEY,{expiresIn:JWT_REFRESH_EXPIRY})
    return refreshToken;
}

export {generateAccessToken,generateRefreshToken}