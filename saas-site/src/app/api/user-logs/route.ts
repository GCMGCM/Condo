import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../lib/mongoose';
import UserLog from '../../../models/user-log';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    if (!session.isAdmin && !session.isSupportTeam) {
      return NextResponse.json({ message: 'Unauthorized - Admin or Support Team access required' }, { status: 403 });
    }

    await connectToMongo();

    // Get last 50 user logs (not admin logs)
    const logs = await UserLog.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ logs }, { status: 200 });
  } catch (err) {
    console.error('Get user logs error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
