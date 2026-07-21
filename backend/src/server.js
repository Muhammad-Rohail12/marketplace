const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const apiRoutes = require('./routes/index');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Core middleware
app.use(express.json());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler (must be last)
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Marketplace API running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});