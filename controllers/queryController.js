const { catchAsync } = require("../utils/catchAsync");
const Query = require("./../models/queryModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllQueries = catchAsync(async (req, res, next) => {
  const totalqueries = await Query.countDocuments();
  const features = new APIFeatures(Query.find(), req.query).paginate();
  const queries = await features.query;
  res.status(200).json({
    status: "success",
    totalqueries,
    totalPages: Math.ceil(totalqueries / 20),
    data: {
      queries,
    },
  });
});
