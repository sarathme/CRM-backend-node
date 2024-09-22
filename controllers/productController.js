const { catchAsync } = require("../utils/catchAsync");
const Product = require("./../models/productModel");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const totalProducts = await Product.countDocuments();

  console.log(req.query.page * 1);

  if (!req.query.sort) {
    req.query.sort = "-createdAt";
  }
  const features = new APIFeatures(Product.find(), req.query).sort().paginate();

  const products = await features.query;

  const totalPages = Math.ceil(totalProducts / products.length);

  if (totalPages === Infinity) {
    return next(new AppError("No more products to be found", 404));
  }

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

  const product = await Product.findById(productId);

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
