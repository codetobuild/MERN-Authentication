const crypto = require("crypto");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const sendEmail = require("../services/sendEmail");
const getEmailText = require("../utils/emailText");

// handle routes
exports.register = async (req, res, next) => {
  const { username, password, email } = req.body;
  try {
    const user = await User.create({ username, password, email });

    // call function
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new errorResponse("Please provide email and password", 400));
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new errorResponse("Invalid credentials", 401));
    }
    // compare the password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return next(new errorResponse("Invalid credentials", 401));
    }
    // call function
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// forgot password
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new errorResponse("Email could not be sent", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;

    const message = getEmailText(resetUrl);

    try {
      await sendEmail({
        to: user.email,
        subject: "test mail",
        html: message,
      });
      return res.status(200).json({ success: true, message: "email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resentPasswordExpire = undefined;

      await user.save();
      return next(new errorResponse("email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  console.log(resetPasswordToken);
  console.log(" ");
  console.log(req.params.resetToken);

  try {         
    const user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resentPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new errorResponse("Invalid password reset", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resentPasswordExpire = undefined;
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "password reset successful" });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

function sendToken(user, statusCode, res) {
  const token = user.getSignedToken();
  console.log(token);
  return res.status(statusCode).json({ success: true, token: token });
}
