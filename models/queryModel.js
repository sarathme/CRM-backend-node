const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Please provide a customer ID"],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  subject: {
    type: String,
    required: [true, "A Query needs a subject"],
  },
  description: {
    type: String,
    required: [true, "Please eloborate your query"],
  },
  raisedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved", "closed"],
    default: "open",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resolutionDetails: {
    type: String,
    required: false,
  },
  resolvedAt: {
    type: Date,
  },
  queryType: {
    type: String,
    enum: ["product", "order", "other"],
    required: [true, "Please provide what is your query is about"],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [
      function () {
        return this.queryType === "product";
      },
      "Please mention the product you are querying about",
    ],
  },
});

const Query = mongoose.model("Query", querySchema);

module.exports = Query;
