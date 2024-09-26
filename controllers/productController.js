const { catchAsync } = require("../utils/catchAsync");
const Product = require("./../models/productModel");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  if (!req.query.page || !req.query.limit) {
    req.query.page = req.query.page || 1;
    req.query.limit = req.query.limit || 10;
  }
  // req.query.productCatogary = "Rustic";
  const totalProducts = await Product.countDocuments(
    new APIFeatures(Product.find(), req.query).filter().query
  );

  if (!req.query.sort) {
    req.query.sort = "-createdAt";
  }
  const features = new APIFeatures(Product.find(), req.query)
    .sort()
    .paginate()
    .filter();

  const products = await features.query;

  const totalPages = Math.ceil(totalProducts / req.query.limit);

  res.status(200).json({
    status: "success",
    totalProducts,
    totalPages,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  // Populating the virtual properties feedbacks and queries of requested products

  const product = await Product.findById(productId)
    .populate("feedbacks")
    .populate("queries");

  if (!product) {
    return next(
      new AppError(`No product found with the id: ${productId}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.getProductStats = catchAsync(async (req, res, next) => {
  const productsPerCatogary = await Product.aggregate([
    { $group: { _id: "$productCatogary", count: { $sum: 1 } } },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      productsPerCatogary,
    },
  });
});
