import { query, initializeDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Initialize database on first request
let dbInitialized = false;

export async function GET() {
  try {
    if (!dbInitialized) {
      await initializeDatabase();
      dbInitialized = true;
    }

    const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
    
    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, tags, image, video, color } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tagsArray = Array.isArray(tags) ? tags : (tags?.split(',').map((t: string) => t.trim()) || []);

    const result = await query(
      `INSERT INTO projects (title, description, category, tags, image, video, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, category, tagsArray, image || null, video || null, color || 'linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%)']
    );

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
