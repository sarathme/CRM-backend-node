const mongoose = require("mongoose");

const Customer = require("./../models/customerModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

const { catchAsync } = require("../utils/catchAsync");

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const totalCustomers = await Customer.countDocuments();

  const features = new APIFeatures(Customer.find(), req.query)
    .sort()
    .limitFields()
    .paginate();

  const customers = await features.query;

  let customerStats;
  if (req.stats) {
    customerStats = req.stats;
  } else {
    customerStats = undefined;
  }

  res.status(200).json({
    status: "success",
    totalCustomers,
    totalPages: Math.ceil(totalCustomers / customers.length),
    data: {
      customers,
      customerStats,
    },
  });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;

  const customer = await Customer.findById(customerId);

  if (!customer) {
    return next(
      new AppError(`No customer found with the id ${customerId}`, 404)
    );
  }

  res.status(200).json({
    satatus: "success",
    data: {
      customer,
    },
  });
});

exports.getSourceStats = catchAsync(async (req, res, next) => {
  const totalCustomer = await Customer.countDocuments();
  const sourceStats = await Customer.aggregate([
    { $group: { _id: "$source", count: { $sum: 1 } } },
  ]);

  const growth = await Customer.aggregate([
    {
      $project: {
        month: { $month: "$joinedAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  sourceStats.forEach((stat) => {
    stat.percentage = Math.round((stat.count / totalCustomer) * 100);
  });

  req.stats = { sourceStats, growth };

  next();
});
