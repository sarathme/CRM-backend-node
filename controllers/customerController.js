const mongoose = require("mongoose");

const Customer = require("./../models/customerModel");
const AppError = require("./../utils/appError");

const { catchAsync } = require("../utils/catchAsync");

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const totalCustomers = await Customer.countDocuments();

  const queryString = req.query;
  let query = Customer.find();

  // Pagination
  const page = queryString.page * 1 || 1;
  const limit = queryString.limit * 1 || 30;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  //Sorting

  if (queryString.sort) {
    const sortBy = queryString.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-joinedAt -lastLogin");
  }

  // Limiting Fields
  if (queryString.fields) {
    const limitFields = queryString.fields.split(",").join(" ");
    query = query.select(limitFields);
  } else {
    query = query.select("firstName lastName phone email");
  }

  const customers = await query;
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
