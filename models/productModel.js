const mongoose = require("mongoose");

require("./feedbackModel");
require("./queryModel");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      unique: true,
      required: [true, "A product must have a name"],
    },
    productMaterial: {
      type: String,
    },
    productCatogary: {
      type: String,
      required: [true, "A product must be inside a category"],
    },

    description: {
      type: String,
    },
    pricePerUnit: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    stockAvailable: {
      type: Number,
      validate: {
        validator: function (val) {
          return val >= 0;
        },
        message: "Stocks cannot be in negative",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Virtual populate field for defining feedbacks of the product

productSchema.virtual("feedbacks", {
  ref: "Feedback",
  foreignField: "productId",
  localField: "_id",
});
// Virtual populate field for defining queries of the product
productSchema.virtual("queries", {
  ref: "Query",
  foreignField: "productId",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
