import AppError from '../utils/AppError.js';

const handleMongooseValidationError = (error)=>{
 const errors = Object.values(error.errors).map((err) => ({
  field: err.path,    
  message: err.message
}));
  return new AppError("Validation Error", 400,errors);  
}

const handleMongoDuplicateError = (error)=>{
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  return new AppError(`${field} '${value}' already exists`,409);
};

const handleJWTError = () => new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () => new AppError('Token expired. Please login again', 401);

const handleCastError = (error) => {
  return new AppError(`Invalid ${error.path}: ${error.value}`, 400);
};


const errorHandler = (error, req, res, next) => {


  let err = error;


   // Transform specific errors into AppError
  if (error.name === 'ValidationError') {
    err = handleMongooseValidationError(error);
  } else if (error.code === 11000) {
    err = handleMongoDuplicateError(error);
  } else if (error.name === 'JsonWebTokenError') {
    err = handleJWTError();
  } else if (error.name === 'TokenExpiredError') {
    err = handleJWTExpiredError();
  } else if (error.name === 'CastError') {
    err = handleCastError(error);
  }
  const statusCode = err.statusCode || 500;
  const status = err.status || "error"
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] ${statusCode} ${message}`, {
    path: req.originalUrl,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });


  
  const response = {
    status,
    message: message,
    
  };

   // Add validation errors if present
  if (err.errors) {
    response.errors = err.errors;
  }


  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;