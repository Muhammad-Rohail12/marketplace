const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config');
const apiRoutes = require('./routes/index');
const requestId = require('./middlewares/requestId.middleware');
const requestLogger = require('./middlewares/requestLogger.middleware');
const notFound = require('./middlewares/notFound.middleware');
const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');

const app = express();

// Request tracking (must run first so every log/response has an ID)
app.use(requestId);
app.use(requestLogger);

// Core middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(config.security.cors));

// Serve locally-uploaded files (dev only — replaced by Cloudinary/object
// storage in production per the project's later phases)
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API routes
app.use('/api', apiRoutes);

// 404 + centralized error handling (must be last, in this order)
app.use(notFound);
app.use(errorHandlerMiddleware);

module.exports = app;