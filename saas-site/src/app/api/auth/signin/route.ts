import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToMongo } from '../../../../lib/mongoose';
import User from '../../../../models/user';
import UserLog from '../../../../models/user-log';
import AdminLog from '../../../../models/admin-log';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    await connectToMongo();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Log the signin action (admin and support team use AdminLog)
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const LogModel = (user.isAdmin || user.isSupportTeam) ? AdminLog : UserLog;
    await new LogModel({
      email: user.email,
      fullName: user.fullName,
      action: 'signin',
      ipAddress,
    }).save();

    // Create session token (simple version - store user info in cookie)
    const userData = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      isAdmin: user.isAdmin || false,
      isSupportTeam: user.isSupportTeam || false,
    };

    const response = NextResponse.json({ user: userData }, { status: 200 });
    
    // Set cookie with user session
    response.cookies.set('user-session', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Signin error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
