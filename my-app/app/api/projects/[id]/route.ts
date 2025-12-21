import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '../shared';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const projectId = parseInt(id);
    
    const index = PROJECTS.findIndex(p => p.id === projectId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    PROJECTS[index] = { ...PROJECTS[index], ...body, id: projectId };
    
    return NextResponse.json({ success: true, data: PROJECTS[index] }, { status: 200 });
  } catch (error) {
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
    
    const index = PROJECTS.findIndex(p => p.id === projectId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const deleted = PROJECTS.splice(index, 1)[0];
    return NextResponse.json({ success: true, data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
