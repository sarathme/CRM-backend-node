const { promisify } = require("util");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const User = require("./../models/userModel");

exports.loginUser = catchAsync(async (req, res, next) => {
  const { empCode, password } = req.body;

  // Checking for the required fields in the request body
  if (!empCode || !password) {
    return next(new AppError("Please provide employee code and password", 400));
  }

  // Finding the user using the provided employee code
  const user = await User.findOne({ empCode }).select("+password");

  // Error response if no user exists with the provided employee code or password is incorrect
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(`Invalid employee code or password`, 401));
  }

  // Sign a JWT token to give access to the employee

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to continue", 401)
    );
  }

  // Verifying JWT token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});

// Authorizarion to access role specific routes.
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
