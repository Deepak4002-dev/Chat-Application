import jwt from 'jsonwebtoken';
import AppError from './AppError.js';
import { JWT_ACCESS_SECRET_KEY } from '../config/constants.js';

const verifyToken = (accessToken)=>{
    if(!accessToken)
    {
       throw new AppError("Token not found",401);
    }
    return jwt.verify(accessToken,JWT_ACCESS_SECRET_KEY);
}

export {verifyToken}