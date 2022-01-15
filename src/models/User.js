const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ERROR } = require('../constants/errors');
const { EMAIL } = require('../utils/validations');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ERROR.NAME_REQ_MSG]
  },
  email: {
    type: String,
    required: [true, ERROR.EMAIL_REQ_MSG],
    unique: true,
    match: [
      EMAIL,
      ERROR.EMAIL_VAL_MSG
    ]
  },
  mobile: {
    type: String,
    required: [true, ERROR.MOBILE_REQ_MSG]
  },
  password: {
    type: String,
    required: [true, ERROR.PASSWD_REQ_MSG],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * @description Before storing password to DB encrypt it using bcrypt
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT || 10));
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * @description Sign JWT and return signed token
 * @returns Singed JWT Token
 */
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/**
 * @description Match user entered password to hashed password in database
 * @param {*} rawPassword User entered password string
 * @returns if hash of user entered password matches returns true,
 *  otherwise false
 */
UserSchema.methods.matchPassword = async function (rawPassword) {
  return await bcrypt.compare(rawPassword, this.password);
};

/**
 * @description generate token and store the hash with expiry
 * @returns resetToken
 */
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire of 10 mins
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
