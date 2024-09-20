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

  console.log(user);
  console.log(user.password);
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
