// Packages import
const express = require("express");

// Internal imports
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const customerRouter = require("./routes/customerRoutes");

// APP CODES

const app = express();

// ROUTES

app.use("/api/v1/customers", customerRouter);

// Fallback route for undefined routes

app.all("*", (req, res, next) => {
  next(new AppError("This route not defined", 404));
});

// Global error middleware for express app

app.use(globalErrorHandler);

module.exports = app;
