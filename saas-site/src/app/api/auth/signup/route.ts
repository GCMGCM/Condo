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
    const fullName = (body.fullName || '').trim();
    const password = body.password || '';
    const gdprConsent = Boolean(body.gdprConsent);

    // Basic validation
    if (!email || !fullName || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (!gdprConsent) {
      return NextResponse.json({ message: 'GDPR consent is required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectToMongo();

    // Check for existing user
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (store minimal data, consent timestamp)
    // Set admin flag for owner email
    const isAdmin = email === 'marcondes.gustavo@gmail.com';
    
    const userDoc = new User({
      email,
      fullName,
      passwordHash,
      isAdmin,
      gdprConsent,
      consentGivenAt: new Date(),
    });

    const saved = await userDoc.save();

    // Log the signup action
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const LogModel = isAdmin ? AdminLog : UserLog;
    await new LogModel({
      email: saved.email,
      fullName: saved.fullName,
      action: 'signup',
      ipAddress,
    }).save();

    // Respond with created user (no sensitive data)
    const userData = { 
      id: saved._id.toString(), 
      email: saved.email, 
      fullName: saved.fullName,
      isAdmin: saved.isAdmin || false,
    };
    
    const response = NextResponse.json({ user: userData }, { status: 201 });
    
    // Set cookie to auto-login user after signup
    response.cookies.set('user-session', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Signup error:', err);
    // Handle duplicate key error from Mongo
    if (err?.code === 11000) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
