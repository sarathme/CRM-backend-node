const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const User = require("./../models/userModel");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const usersAll = await User.find();

  // Filter out admins from the users collection
  const users = usersAll.filter((user) => user.role !== "admin");

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError(`No user found with the id ${userId}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, password, personalEmail, empCode } = req.body;

  if (!name && !password && !empCode && personalEmail) {
    return next(new AppError("Please provide required fields", 400));
  }

  const newUser = { name, password, personalEmail, empCode };

  const user = await User.create(newUser);

  user.password = undefined;

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});
