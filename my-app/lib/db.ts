import { neon } from '@neondatabase/serverless';

let sql: any = null;

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
} else {
  console.warn('⚠️ DATABASE_URL not set, database features will be disabled');
}

export async function query(text: string, params?: any[]) {
  if (!sql) {
    console.error('Database not configured. DATABASE_URL is missing.');
    return [];
  }
  try {
    console.log('Executing query:', text);
    // Use sql.query() for conventional parameterized queries
    const result = await sql.query(text, params);
    console.log('Query result:', result);
    return Array.isArray(result) ? result : (result as any).rows || [];
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
      images TEXT[] DEFAULT ARRAY[]::TEXT[],
      video TEXT,
      color VARCHAR(255) DEFAULT 'linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%)',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const addImagesColumnQuery = `
    ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];
  `;

  const createProfileTableQuery = `
    CREATE TABLE IF NOT EXISTS profile (
      id SERIAL PRIMARY KEY,
      profile_image TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await query(createTableQuery);
    console.log('✅ Database schema initialized');
    
    // Add images column if it doesn't exist
    await query(addImagesColumnQuery);
    console.log('✅ Images column verified/added');

    // Create profile table
    await query(createProfileTableQuery);
    console.log('✅ Profile table initialized');

    // Insert default profile if doesn't exist
    await query(`
      INSERT INTO profile (id, profile_image) 
      VALUES (1, NULL) 
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✅ Default profile record ensured');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}
