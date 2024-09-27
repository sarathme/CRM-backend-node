const AppError = require("./../utils/appError");
// Global error handling middleware for entire express app.

// Function to handle errors on development

const sendDevErr = (err, req, res) => {
  // Error response with all error properties.
  //Useful to see errors during development.

  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Function to handle errors on production

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const msgArr = Object.entries(err.keyValue);
  const message = `${msgArr[0][0]} ${msgArr[0][1]} already exists`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = err.message.split(":")[2].trim();
  return new AppError(message, 400);
};

const sendProdErr = (err, res) => {
  //  Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevErr(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    sendProdErr(error, res);
  }
};
