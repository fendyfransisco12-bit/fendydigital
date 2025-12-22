import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    console.log('Fetching projects from database...');
    const projects = await query('SELECT * FROM projects ORDER BY created_at DESC');
    console.log('Projects fetched:', projects);
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, description, category, tags, image, video, color } = body;
    const projectName = name || title;

    if (!projectName || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing fields' },
        { status: 400 }
      );
    }

    const tagsArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []);

    const result = await query(
      'INSERT INTO projects (title, description, category, tags, image, video, color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [projectName, description, category, tagsArray, image || null, video || null, color || '#3498db']
    );

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
