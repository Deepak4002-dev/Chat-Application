import { NODE_ENV } from "./constants.js";

export const accessTokenCookieOptions = {
  httpOnly:true,
  secure: NODE_ENV==='production',
  sameSite:"strict",
  maxAge:60 * 15 * 1000,
  path:'/'
}

export const refreshTokenCookieOptions = {
  httpOnly:true,
  secure: NODE_ENV==='production',
  sameSite:"strict",
  maxAge:7 * 24 * 60 * 60 * 1000, 
  path:'/api/v1/auth/refresh'
}


export const clearCookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};


// maxAge:7 * 24 * 60 * 60 * 1000, 