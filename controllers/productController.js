const { catchAsync } = require("../utils/catchAsync");
const Product = require("./../models/productModel");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const totalProducts = await Product.countDocuments();
  const features = new APIFeatures(Product.find(), req.query).paginate();

  const products = await features.query;

  if (!products.length) {
    return next(new AppError("No more products to be found", 404));
  }

  res.status(200).json({
    status: "success",
    totalProducts,
    totalPages: Math.ceil(totalProducts / products.length),
    data: {
      products,
    },
  });
});
