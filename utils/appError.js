// CUSTOM APPERROR CLASS EXTENDING THE ERROR CLASS FOR CUSTOM ERROR RESPONSES.

class AppError extends Error {
  constructor(message, statusCode) {
    // Calling The Error class (parent class).
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // This isOperational field is used to indicate the errors which are handled by us.
    // Other errors donot have this field so we can distinguish the errors.

    this.isOperational = true;

    // This is to remove the AppError class in the stack trace for some clean error logs.

    Error.captureStackTrace(this, this.constructor);
  }
}

// Exporting the AppError class.

module.exports = AppError;
