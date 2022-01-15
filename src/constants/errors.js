/**
 * @description Common custom error constants
 */
const ERROR = {
  CAST_ERR: 'CastError',
  CAST_ERR_MSG: 'Resource not found',

  DB_PARSE_ERR: 'MongoParseError',
  DB_PARSE_ERR_MSG: 'Error: Invalid connection string.',

  DB_CONN_ERR: 'MongoAPIError',
  DB_CONN_ERR_MSG: 'Error:',

  VALIDATION_ERR: 'ValidationError',

  SERVER_ERR_MSG: 'Server Error',
  DUP_KEY_MSG: 'This email is already registered',

  NAME_REQ_MSG: 'Name is required',
  EMAIL_REQ_MSG: 'Email is required',
  EMAIL_VAL_MSG: 'Please add valid email',
  MOBILE_REQ_MSG: 'Mobile number is required',
  PASSWD_REQ_MSG: 'Password is required',
  ALL_FIELDS_MAN: 'Please fill all mandatory fields. Name, email, password, mobile number.',
  UPDATE_FIELDS_MAN: 'Please fill all mandatory fields. Name, mobile number.',
  PASS_NOT_STRONG: 'Password is not strong enough',
  LOGIN_ALL_FIELDS_MAN: 'Please provide an email and password',
  INVALID_CRED: 'Invalid credentials',
  AUTHORIZATION_ERR: 'You are not authorized',
  INCORRECT_PASS: 'Current password is incorrect',
  USER_NOT_FOUND: 'User not found. Please enter valid email',
  INVALID_RESET_TOKEN: 'Invalid Token'
};

module.exports = {
  ERROR
};
