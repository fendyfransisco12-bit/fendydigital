import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from './shared';

export async function GET() {
  return NextResponse.json({ success: true, data: PROJECTS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, description, category, tags, image, color } = body;
    const projectName = name || title;

    if (!projectName || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing fields' },
        { status: 400 }
      );
    }

    const newProject = {
      id: Math.max(...PROJECTS.map(p => p.id), 0) + 1,
      name: projectName,
      description,
      category,
      image: image || null,
      color: color || '#3498db',
      tags: Array.isArray(tags) ? tags : [],
    };

    PROJECTS.push(newProject);

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
