import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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
      `UPDATE projects 
       SET title = $1, description = $2, category = $3, tags = $4, image = $5, video = $6, color = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, description, category, tagsArray, image || null, video || null, color || 'linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%)', id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const result = await query(
      'DELETE FROM projects WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
