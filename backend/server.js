const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Connect Database
connectDB();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve uploads static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ShopVerse API Server is running smoothly' });
});

// Fallback to frontend index.html for root or unknown routes
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 ShopVerse Server running on port ${PORT} at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = 5005;
    console.log(`⚠️ Port ${PORT} is currently occupied. Switching to fallback port ${fallbackPort}...`);
    app.listen(fallbackPort, () => {
      console.log(`🚀 ShopVerse Server running on fallback port ${fallbackPort} at http://localhost:${fallbackPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

