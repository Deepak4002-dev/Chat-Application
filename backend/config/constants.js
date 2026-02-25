export const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
export const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
export const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 10000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const FRONTEND_URL = process.env.FRONTEND_URL;