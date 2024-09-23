const { catchAsync } = require("../utils/catchAsync");
const Feedback = require("./../models/feedbackModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllFeedbacks = catchAsync(async (req, res, next) => {
  const totalFeedbacks = await Feedback.countDocuments();
  const features = new APIFeatures(Feedback.find(), req.query)
    .filter()
    .paginate();
  const feedbacks = await features.query.populate({
    path: "customerId",
    select: "firstName lastName",
  });
  res.status(200).json({
    status: "success",
    totalFeedbacks,
    totalPages: Math.ceil(feedbacks.length / 20),
    data: {
      feedbacks,
    },
  });
});
