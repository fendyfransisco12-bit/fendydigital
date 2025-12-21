import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text: string, params?: any[]) {
  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      tags TEXT[] DEFAULT ARRAY[]::TEXT[],
      image TEXT,
      video TEXT,
      color VARCHAR(255) DEFAULT 'linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%)',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await query(createTableQuery);
    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}
