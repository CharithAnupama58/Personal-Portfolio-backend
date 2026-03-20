const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, initializeDatabase } = require('./db/database');

const contactRoutes = require('./routes/contact');
const blogRoutes = require('./routes/blog');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 5000;
console.log('Server ekata awa');
app.use(helmet());
app.use(cors({
  origin: 'https://personal-portfolio-frontend-fmfq.vercel.app',
  credentials: true
}))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/projects', projectRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected successfully');
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
}

startServer();