const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const { ERROR } = require('../constants/errors');
const { isPasswordAllowed, isEmailAllowed } = require('../utils/validations');
const ErrorResponse = require('../utils/errorResponse');
const { logger } = require('../utils/logger');

/**
 * @description Register new user
 * @route       POST /api/v1/auth/register
 * @access      PUBLIC
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, mobile } = req.body;

  // Validate required data
  if (!name || !email || !password || !mobile) {
    return res.status(400).json({
      status: false,
      error: ERROR.ALL_FIELDS_MAN
    });
  }

  // Validate password and email against regex and other params.
  const errors = [];
  if (!isPasswordAllowed(password.trim())) {
    errors.push({ password: ERROR.PASS_NOT_STRONG });
  }

  if (!isEmailAllowed(email.trim())) {
    errors.push({ email: ERROR.EMAIL_VAL_MSG });
  }

  // If errors in password and email return errors.
  if (errors.length > 0) {
    return res.status(400).json({
      status: false,
      error: errors
    });
  }

  try {
    // Create a new user
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      mobile: mobile.trim()
    });

    // On successful creation of user send success response.
    // @TODO: Do not send all data
    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    // Mongoose duplicate key
    if (error.code === 11000) {
      const message = ERROR.DUP_KEY_MSG;
      const error = new ErrorResponse(message, 400);

      return res.status(error.statusCode).json({
        success: false,
        error: error.message || ERROR.SERVER_ERR_MSG
      });
    }
    // If any other error occures then let common error handler handle it.
    // Do not throw exact errors in production mode
    // @TODO: Add some err codes so that it will be easy to debug if production crases.
    throw Error(process.env.NODE_ENV === 'development' ? error : 'Something went wrong.');
  }
});

/**
 * @description Login user
 * @route       POST /api/v1/auth/login
 * @access      Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req?.body;

  // If any of is not valid then return error
  if (!email.trim() || !password.trim()) {
    return next(new ErrorResponse(ERROR.LOGIN_ALL_FIELDS_MAN, 400));
  }

  // check for existing user
  const user = await User.findOne({ email }).select('+password');

  // If user not found return authentication error
  if (!user) {
    return next(new ErrorResponse(ERROR.INVALID_CRED, 401));
  }

  // Check for password matches or not, if not return error
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(ERROR.INVALID_CRED, 401));
  }

  // If both email and password matches return success and JWT signed token.
  sendTokenResponse(user, 200, res);
});

/**
 * @description Log user out / clear cookie
 * @route       GET /api/v1/auth/logout
 * @access      Public
 */
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() - (10 * 1000)),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @description Get current logged in user
 * @route       GET /api/v1/auth/me
 * @access      Protected
 */
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req?.user?.id);

  res.status(200).json({
    status: true,
    data: parseUser(user)
  });
});

/**
 * @description Update user details
 * @route       PUT /api/v1/auth/updatedetails
 * @access      Protected
 */
const updateDetails = asyncHandler(async (req, res, next) => {
  const { name, mobile } = req?.body;

  if (!name.trim() || !mobile.trim()) {
    return res.status(400).json({
      status: false,
      error: ERROR.UPDATE_FIELDS_MAN
    });
  }
  const fieldsToUpdate = { name: name.trim(), mobile: mobile.trim() };

  try {
    const user = await User.findByIdAndUpdate(req?.user?.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: parseUser(user)
    });
  } catch (error) {
    return next(new ErrorResponse(ERROR.AUTHORIZATION_ERR, 401));
  }
});

/**
 * @description Update password of logged in user
 * @route       PUT /api/v1/auth/updatepassword
 * @access      Protected
 */
const updatePassword = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req?.user?.id).select('+password');

    const { currentPassword, newPassword } = req.body;
    // Check current password
    if (!(await user.matchPassword(currentPassword.trim()))) {
      return next(new ErrorResponse(ERROR.INCORRECT_PASS, 401));
    }

    const errors = [];
    if (!isPasswordAllowed(newPassword.trim())) {
      errors.push({ newPassword: ERROR.PASS_NOT_STRONG });
    }

    // If errors in password return error.
    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        error: errors
      });
    }

    user.password = newPassword.trim();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return next(new ErrorResponse(ERROR.AUTHORIZATION_ERR, 401));
  }
});

/**
 * @description Forgot password, send password reset link
 * @route       POST /api/v1/auth/forgotpassword
 * @access      Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body?.email });

  // Return error if email not found
  if (!user) {
    return next(new ErrorResponse(ERROR.USER_NOT_FOUND, 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password.
  Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    // @TODO send email for password reset.
    /* await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    }); */

    /* res.status(200).json({ success: true, data: 'Email sent' }); */
    // @TODO Do not send link in res, send via mail

    res.status(200).json({
      success: true,
      data: {
        resetUrl,
        message
      }
    });
  } catch (err) {
    logger.err(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    // @TODO Update this block once email functionality added.
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

/**
 * @description Reset password
 * @route       PUT /api/v1/auth/resetpassword/:resettoken
 * @access      Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  // Check for reset token
  const token = req?.params?.resettoken;
  const { newPassword } = req.body;

  if (!token) {
    return next(new ErrorResponse(ERROR.INVALID_RESET_TOKEN, 400));
  }

  if (!newPassword.trim()) {
    return next(new ErrorResponse(ERROR.PASSWD_REQ_MSG, 400));
  }

  // Check for password validity
  const errors = [];
  if (!isPasswordAllowed(newPassword.trim())) {
    errors.push({ newPassword: ERROR.PASS_NOT_STRONG });
  }

  // If errors in password return error.
  if (errors.length > 0) {
    return res.status(400).json({
      status: false,
      error: errors
    });
  }

  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

  if (!user) {
    next(new ErrorResponse(ERROR.INVALID_RESET_TOKEN, 400));
  }

  try {
    // Set new password
    user.password = newPassword?.trim();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        user: parseUser(user)
      }
    });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      data: {
        token,
        user: parseUser(user)
      }
    });
};

const parseUser = user => {
  const omit = ['__v', 'password'];
  const keys = Object.keys(user._doc);

  if (keys.length > 0) {
    keys.forEach(key => {
      if (omit.includes(key)) {
        delete user._doc[key];
      }
    });
  }

  return user;
};
module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
};
