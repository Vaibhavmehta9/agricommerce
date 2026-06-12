require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const uploadDir = require('./config/uploads');
const errorHandler = require('./middleware/error');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const homepageRoutes = require('./routes/homepageRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Connect to database
connectDB();

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Vercel production + preview URLs (e.g. https://agricommerce.vercel.app)
  if (/^https:\/\/[\w.-]+\.vercel\.app$/.test(origin)) return true;
  return false;
};

// CORS configuration
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static upload files
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AgriCommerce API is running', timestamp: new Date().toISOString() });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 API base: http://localhost:${PORT}/api`);
});

module.exports = app;
