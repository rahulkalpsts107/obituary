require('dotenv').config();

// Initialize Sentry before any other imports
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Capture more data
  beforeSend(event) {
    console.log('Sentry event captured:', event.event_id);
    return event;
  },
  beforeSendTransaction(event) {
    console.log('Sentry transaction captured:', event.event_id);
    return event;
  },
  debug: true, // Enable debug mode for troubleshooting
});

// Log Sentry initialization
console.log('Sentry initialized with DSN:', process.env.SENTRY_DSN ? 'Configured' : 'Missing');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const obituaryRoutes = require('./routes/obituary');
const condolenceRoutes = require('./routes/condolences');

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sentry request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', obituaryRoutes);
app.use('/api/condolences', condolenceRoutes);

// Sentry error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
