const Customer = require("./../models/customerModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

const { catchAsync } = require("../utils/catchAsync");

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  if (!req.query.page || !req.query.limit) {
    req.query.page = req.query.page || 1;
    req.query.limit = req.query.limit || 10;
  }

  let query = Customer.find();

  if (req.query.status && req.query.status !== "all") {
    const now = Date.now();
    const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);

    if (req.query.status === "active") {
      query = query.find({
        lastLogin: { $gte: last30Days },
      });
    }
    if (req.query.status === "new") {
      query = query.find({ joinedAt: { $gte: last30Days } });
    }
    if (req.query.status === "inactive") {
      query = query.find({ lastLogin: { $lt: last30Days } });
    }
  }

  let totalCustomers = await Customer.countDocuments(
    new APIFeatures(query, req.query).query
  );

  const features = new APIFeatures(query, req.query).paginate();

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
    cusPerPage: customers.length,
    totalPages: Math.ceil(totalCustomers / req.query.limit),
    data: {
      customers,
      customerStats,
    },
  });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;

  // Populating the virtual properties feedbacks and queries for the requested customers.

  const customer = await Customer.findById(customerId)
    .populate("feedbacks")
    .populate("queries");

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
