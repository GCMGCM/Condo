import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../lib/mongoose';
import AdminLog from '../../../../models/admin-log';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    if (!session.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectToMongo();

    // Get last 10 signin logs for this admin
    const logs = await AdminLog.find({ 
      email: session.email,
      action: 'signin'
    })
    .sort({ timestamp: -1 })
    .limit(10)
    .lean();

    return NextResponse.json({ logs }, { status: 200 });
  } catch (err) {
    console.error('Get admin logs error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
