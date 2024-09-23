// Packages import
const express = require("express");
const cors = require("cors");

// Internal imports
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const customerRouter = require("./routes/customerRoutes");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const queryRouter = require("./routes/queryRoutes");
const feedbackRouter = require("./routes/feedbackRoutes");

// APP CODES

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Middleware to attach body to the request object
app.use(express.json());

// ROUTES

// Customers route
app.use("/api/v1/customers", customerRouter);

// Products route
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/queries", queryRouter);
app.use("/api/v1/feedbacks", feedbackRouter);

// Fallback route for undefined routes

app.all("*", (req, res, next) => {
  next(new AppError("This route not defined", 404));
});

// Global error middleware for express app

app.use(globalErrorHandler);

module.exports = app;
