const { ERROR } = require('../constants/errors');
const ErrorResponse = require('../utils/errorResponse');
const { log } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  log(err);

  // Mongoose bad ObjectId
  if (err.name === ERROR.CAST_ERR) {
    const message = ERROR.CAST_ERR_MSG;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = ERROR.DUP_KEY_MSG;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === ERROR.VALIDATION_ERR) {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || ERROR.SERVER_ERR_MSG
  });
};

module.exports = errorHandler;
