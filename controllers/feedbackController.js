const { catchAsync } = require("../utils/catchAsync");
const Feedback = require("./../models/feedbackModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllFeedbacks = catchAsync(async (req, res, next) => {
  if (!req.query.page || !req.query.limit) {
    req.query.page = req.query.page || 1;
    req.query.limit = req.query.limit || 20;
  }

  const query = Feedback.find();

  const totalFeedbacks = await Feedback.countDocuments(
    new APIFeatures(query, req.query).filter().query
  );

  const features = new APIFeatures(query, req.query).filter().paginate();

  const feedbacks = await features.query.populate({
    path: "customerId",
    select: "firstName lastName",
  });

  res.status(200).json({
    status: "success",
    totalFeedbacks,
    totalPages: Math.ceil(totalFeedbacks / (req.query.limit * 1)),
    data: {
      feedbacks,
    },
  });
});

exports.getFeedbackStats = catchAsync(async (req, res, next) => {
  const stats = await Feedback.aggregate([
    {
      $group: {
        _id: "$feedbackType",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
