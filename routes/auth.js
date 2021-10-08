const express = require("express");
const Router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/forgotpassword").post(forgotPassword);
Router.route("/resetpassword/:resetToken").put(resetPassword);


//export the route          
module.exports = Router;