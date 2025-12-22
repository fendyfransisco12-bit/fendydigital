import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

export async function query(text: string, params?: any[]) {
  try {
    console.log('Executing query:', text);
    // Use sql.query() for conventional parameterized queries
    const result = await sql.query(text, params);
    console.log('Query result:', result);
    return Array.isArray(result) ? result : result.rows || [];
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
