const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Please provide a customer ID"],
  },
  rating: {
    type: Number,
    validate: {
      validator: function (val) {
        return val > 1.0 && val < 5.0;
      },
      message: "Please rate between 1.0 and 5.0",
    },
  },
  subject: {
    type: String,
    required: [true, "A Query needs a subject"],
  },
  description: {
    type: String,
    required: [true, "Please eloborate your query"],
  },
  givenAt: {
    type: Date,
    default: Date.now,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [
      true,
      "Please mention the product you are giving feedback about",
    ],
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
