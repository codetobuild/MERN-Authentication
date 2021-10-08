const errorResponse = require("../utils/errorResponse");

const customErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || "server error";
  error.statusCode = error.statusCode || 500;

  // if duplicate data exist in db
  if (error.code === 11000) {
    const message = `Duplicate field value Enter`;
    error = new errorResponse(message, 400);
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new errorResponse(message, 400);
  }
  console.log(err.message);
  return res.status(error.statusCode).json({
    success: false,
    error: error.message,
  });
};

module.exports = customErrorHandler;
