import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../lib/mongoose';
import UserLog from '../../../../models/user-log';
import AdminLog from '../../../../models/admin-log';

export async function POST(req: NextRequest) {
  try {
    // Get user info from session before clearing it
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (sessionCookie) {
      const user = JSON.parse(sessionCookie.value);
      
      // Log the signout action (admin and support team use AdminLog)
      await connectToMongo();
      const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const LogModel = (user.isAdmin || user.isSupportTeam) ? AdminLog : UserLog;
      
      await new LogModel({
        email: user.email,
        fullName: user.fullName,
        action: 'signout',
        ipAddress,
      }).save();
    }
  } catch (err) {
    console.error('Logout log error:', err);
    // Continue with logout even if logging fails
  }

  const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
  
  // Clear the session cookie
  response.cookies.set('user-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
