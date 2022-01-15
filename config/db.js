const mongoose = require('mongoose');
const { ERROR } = require('../src/constants/errors');
const { logger } = require('../src/utils/logger');

const isDev = process.env.NODE_ENV === 'development';

const connectDB = async () => {
  try {
    const { NODE_ENV, MONGO_URI, MONGO_URL_DEV } = process.env;
    const connectionUrl = NODE_ENV === 'production' ? MONGO_URI : MONGO_URL_DEV;
    const conn = await mongoose.connect(connectionUrl);

    logger.green(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error?.name === ERROR.DB_PARSE_ERR) {
      logger.err(ERROR.DB_PARSE_ERR_MSG + isDev ? ` Error: ${error.message}` : '');
      return;
    }
    if (error?.name === ERROR.DB_CONN_ERR) {
      logger.err(ERROR.DB_CONN_ERR_MSG + error?.message);
      return;
    }
    logger.err(error.name);
  }
};

module.exports = connectDB;
