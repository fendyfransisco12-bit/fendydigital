import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const projectId = parseInt(id);
    const { title, description, category, tags, image, video, color } = body;

    const tagsArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : undefined);

    const result = await query(
      'UPDATE projects SET title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category), tags = COALESCE($4, tags), image = COALESCE($5, image), video = COALESCE($6, video), color = COALESCE($7, color), updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [title || null, description || null, category || null, tagsArray || null, image || null, video || null, color || null, projectId]
    );

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] }, { status: 200 });
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    const result = await query(
      'DELETE FROM projects WHERE id = $1 RETURNING *',
      [projectId]
    );

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
