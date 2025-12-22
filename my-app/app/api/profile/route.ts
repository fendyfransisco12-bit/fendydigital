import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    console.log('📖 Fetching profile...');
    const result = await query('SELECT profile_image FROM profile WHERE id = 1');
    console.log('✅ Profile fetched:', result);
    const profileImage = result.length > 0 ? result[0].profile_image : null;
    return NextResponse.json({ success: true, data: { profileImage } });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileImage } = body;

    console.log('📝 Updating profile with image:', profileImage);

    // First ensure profile record exists
    await query(
      'INSERT INTO profile (id, profile_image) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET profile_image = $1, updated_at = CURRENT_TIMESTAMP',
      [profileImage || null]
    );

    // Then fetch the updated record
    const result = await query('SELECT profile_image FROM profile WHERE id = 1');
    
    console.log('✅ Profile updated, result:', result);

    return NextResponse.json({ 
      success: true, 
      data: { profileImage: result.length > 0 ? result[0].profile_image : null } 
    });
  } catch (error) {
    console.error('Failed to update profile:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
