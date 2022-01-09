const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./src/middleware/error');
const connectDB = require('./config/db');
const { logger } = require('./src/utils/logger');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
// const bootcamps = require('./routes/bootcamps');
// const courses = require('./routes/courses');
const auth = require('./src/routes/auth');
// const users = require('./routes/users');
// const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
// app.use('/api/v1/bootcamps', bootcamps);
// app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
// app.use('/api/v1/users', users);
// app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT, logger.green(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  if (process.env.NODE_ENV === 'development') {
    logger.err(`Error: ${err.message}`);
  }

  logger.err(`unhandledRejection error: ${err.name}`)
  // Close server & exit process
  // server.close(() => process.exit(1));
});