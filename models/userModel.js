const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user should have a name"],
  },
  empCode: {
    type: String,
    required: [true, "Please provide a employee Code"],
    unique: true,
  },
  personalEmail: {
    type: String,
    required: [true, "A user should be provided with an personal email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },

  role: {
    type: String,
    enum: ["admin", "manager", "sales", "executive"],
    default: "executive",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Mongoose middleware to handle password encryption

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
