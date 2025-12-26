import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToMongo } from '../../../../lib/mongoose';
import User from '../../../../models/user';

export async function POST(req: Request) {
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
    const userDoc = new User({
      email,
      fullName,
      passwordHash,
      gdprConsent,
      consentGivenAt: new Date(),
    });

    const saved = await userDoc.save();

    // Respond with created user (no sensitive data)
    const user = { id: saved._id, email: saved.email, fullName: saved.fullName, createdAt: saved.createdAt };
    return NextResponse.json({ user }, { status: 201 });
  } catch (err: any) {
    console.error('Signup error:', err);
    // Handle duplicate key error from Mongo
    if (err?.code === 11000) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
