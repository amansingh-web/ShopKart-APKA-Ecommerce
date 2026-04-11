const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const app = express();

// ─── Middleware ─────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// ✅ SEED ROUTE (IMPORTANT)
const seedData = require('./seed');

app.get('/api/seed', async (req, res) => {
  try {
    await seedData();
    res.send('Database Seeded');
  } catch (error) {
    res.status(500).send('Seeding Failed');
  }
});

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'ShopKart API Running' })
);
// YE ADD KIYA HAI
app.get('/', (req, res) => {
  res.send('ShopKart Backend Running 🚀');
});
// ─── Error Handler ─────────────────────────────────────
app.use(require('./middleware/errorHandler'));

// ─── DB + Server ──────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });