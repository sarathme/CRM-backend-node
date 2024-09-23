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
