const express = require("express");
const Router = express.Router();
const { getPrivateData } = require("../controllers/private");
const { protect } = require("../middlewares/auth");

Router.route("/").get(protect, getPrivateData);

//export the route
module.exports = Router;
