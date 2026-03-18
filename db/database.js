const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false
  }
});


const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        tags TEXT[],
        read_time INTEGER DEFAULT 5,
        is_published BOOLEAN DEFAULT TRUE,
        published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        technologies TEXT[],
        github_url VARCHAR(500),
        featured BOOLEAN DEFAULT FALSE,
        year INTEGER,
        category VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      INSERT INTO projects (title, description, technologies, github_url, featured, year, category)
      VALUES
        ('Cake O Clock System','Web-based bakery management with online ordering and Stripe payments.',
         ARRAY['React.js','Node.js','Express.js','MySQL','Tailwind CSS','Stripe'],
         'https://github.com/CharithAnupama58', true, 2024, 'Full Stack'),
        ('Temperature Monitoring System','Real-time monitoring with WebSocket notifications and email alerts.',
         ARRAY['React.js','Node.js','Express.js','MySQL','WebSocket'],
         'https://github.com/CharithAnupama58', true, 2024, 'Full Stack'),
        ('Data Engineering Log Analysis Tool','Log pipeline with PostgreSQL storage and Kafka streaming alerts.',
         ARRAY['Python','PostgreSQL','Kafka','Regex','JavaScript'],
         'https://github.com/CharithAnupama58', true, 2025, 'Data Engineering'),
        ('ECG Lab Test Multi Model','ML model classifying ECG signals with 95% accuracy.',
         ARRAY['Python','NumPy','Pandas','Scikit-learn','Matplotlib'],
         'https://github.com/CharithAnupama58', true, 2025, 'Machine Learning'),
        ('ECG Classification Model','ConvNeXt1D + Attention Pooling ECG classifier at 80% accuracy.',
         ARRAY['Python','TensorFlow','Keras','ConvNeXt1D'],
         'https://github.com/CharithAnupama58', false, 2025, 'Deep Learning'),
        ('Tea Factory Management System','Customer registration and payment management for tea factory.',
         ARRAY['Java','MySQL'],
         'https://github.com/CharithAnupama58', false, 2025, 'Desktop')
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO blog_posts (title, slug, excerpt, content, tags, read_time)
      VALUES
        ('Building Real-Time Systems with WebSocket and Node.js',
         'building-realtime-systems-websocket-nodejs',
         'How I built a production-ready real-time temperature monitoring system.',
         'Full content here...', ARRAY['Node.js','WebSocket','React'], 6),
        ('Microservices in Healthcare: Lessons from MobiOs',
         'microservices-healthcare-mobios-lessons',
         'Insights from the Medica Project Series using microservices.',
         'Full content here...', ARRAY['Microservices','Agile','Healthcare'], 8),
        ('From ECG Signals to ML Models: A Deep Dive',
         'ecg-signals-machine-learning-deep-dive',
         'Building an ECG classifier with ConvNeXt1D achieving 80% accuracy.',
         'Full content here...', ARRAY['ML','ECG','TensorFlow'], 10)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Database initialized and seeded successfully');
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };