import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../lib/mongoose';
import AdminLog from '../../../../models/admin-log';
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

    // Get all support team member emails
    const supportTeam = await User.find({ isSupportTeam: true }).select('email').lean();
    const supportEmails = supportTeam.map(m => m.email);

    // Get last 50 admin logs for support team members only
    const logs = await AdminLog.find({ email: { $in: supportEmails } })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ logs }, { status: 200 });
  } catch (err) {
    console.error('Get support team logs error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
