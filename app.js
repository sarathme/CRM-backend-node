// Packages import
const express = require("express");

// Internal imports
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const customerRouter = require("./routes/customerRoutes");
const productRouter = require("./routes/productRoutes");

// APP CODES

const app = express();

// ROUTES

// Customers route
app.use("/api/v1/customers", customerRouter);

// Products route
app.use("/api/v1/products", productRouter);

// Fallback route for undefined routes

app.all("*", (req, res, next) => {
  next(new AppError("This route not defined", 404));
});

// Global error middleware for express app

app.use(globalErrorHandler);

module.exports = app;
