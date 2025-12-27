import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../lib/mongoose';
import User from '../../../../models/user';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    // Admin and support team can view this
    if (!session.isAdmin && !session.isSupportTeam) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectToMongo();

    // Get all support team members
    const members = await User.find({ isSupportTeam: true })
      .select('email fullName createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ members }, { status: 200 });
  } catch (err) {
    console.error('Get support team members error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
