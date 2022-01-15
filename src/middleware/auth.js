const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const { ERROR } = require('../constants/errors');

/**
 * @description Check for protected routes
 * 1. check for Token exists
 * 2. If yes. check for it's validity and verify it
 * 3. Otherwise return error as not authorized.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    // set token from header
    token = req.headers.authorization.split(' ')[1];
    // @TODO: Check for req.cookies.token and validate.
  }

  if (!token) {
    return next(new ErrorResponse(ERROR.AUTHORIZATION_ERR, 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse(ERROR.AUTHORIZATION_ERR, 401));
  }
});

module.exports = {
  protect
};
