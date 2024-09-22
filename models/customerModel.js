const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    source: {
      type: String,
      required: [true, "Please provide a source"],
    },
    joinedAt: {
      type: Date,
      default: Date.now(),
    },
    lastLogin: {
      type: Date,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide an email"],
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Virtual property to derive status of the customers

customerSchema.virtual("status").get(function () {
  const now = Date.now();
  const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);

  if (this.joinedAt >= last30Days) {
    return "new";
  } else if (this.lastLogin >= last30Days) {
    return "active";
  } else {
    return "inactive";
  }
});

// Virtual populate field for defining feedbacks of the customer

customerSchema.virtual("feedbacks", {});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
