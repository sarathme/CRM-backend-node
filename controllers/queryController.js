const { catchAsync } = require("../utils/catchAsync");
const Query = require("./../models/queryModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllQueries = catchAsync(async (req, res, next) => {
  if (!req.query.page || !req.query.limit) {
    req.query.page = req.query.page || 1;
    req.query.limit = req.query.limit || 20;
  }

  const query = Query.find();
  const totalqueries = await Query.countDocuments(
    new APIFeatures(query, req.query).filter().query
  );
  const features = new APIFeatures(query, req.query).filter().paginate();
  const queries = await features.query
    .populate({
      path: "customerId",
      select: "firstName lastName",
    })
    .populate({
      path: "productId",
      select: "productName",
    });
  res.status(200).json({
    status: "success",
    totalqueries,
    totalPages: Math.ceil(totalqueries / req.query.limit),
    data: {
      queries,
    },
  });
});

exports.getQueryStats = catchAsync(async (req, res, next) => {
  const stats = await Query.aggregate([
    {
      $group: {
        _id: "$queryType",
        count: { $sum: 1 },
      },
    },
  ]);
  const stats2 = await Query.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
      stats2,
    },
  });
});
