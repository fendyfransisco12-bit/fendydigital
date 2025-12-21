import { NextRequest, NextResponse } from 'next/server';

const PROJECTS = [
  {
    id: 1,
    name: 'Portofolio Website',
    description: 'Personal portfolio website dengan React',
    category: 'coding',
    image: 'https://via.placeholder.com/400x300?text=Portfolio',
    color: '#3498db',
    tags: ['React', 'CSS', 'JavaScript'],
  },
  {
    id: 2,
    name: 'Logo Design',
    description: 'Desain logo modern untuk startup',
    category: 'design',
    image: 'https://via.placeholder.com/400x300?text=Logo',
    color: '#e74c3c',
    tags: ['Adobe XD', 'Illustrator'],
  },
];

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
