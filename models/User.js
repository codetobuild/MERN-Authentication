const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
  },
  email: {
    type: String,
    required: [true, "Please provide user email"],
    unique: true,
    match: [emailRegex, "Please provide valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    min: 6,
    select: false,
  },
  resetPasswordToken: String,
  resentPasswordExpire: Date,
});

// mongoose middle ware
UserSchema.pre("save", async function (next) {
  // this refers to the object model
  if (!this.isModified("password")) {
    // if not modified
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JSON_SECRET, {
    expiresIn: process.env.JSON_EXPIRES,
  });
};
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(50).toString("hex");

  // hash the password reset token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resentPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
