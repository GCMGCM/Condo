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
    await connectToMongo();

    const user = await User.findById(session.id).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error('Get profile error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const body = await req.json();

    await connectToMongo();

    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update allowed fields
    if (body.fullName) user.fullName = body.fullName.trim();
    if (body.mobileCountry !== undefined) user.mobileCountry = body.mobileCountry.trim();
    if (body.mobileNumber !== undefined) user.mobileNumber = body.mobileNumber.trim();
    if (body.email && body.email !== user.email) {
      // Check if new email is already taken
      const existing = await User.findOne({ email: body.email.toLowerCase() });
      if (existing) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
      }
      user.email = body.email.toLowerCase().trim();
    }

    await user.save();

    // Update session cookie with new data
    const updatedUserData = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      isAdmin: user.isAdmin || false,
    };

    const response = NextResponse.json({ 
      user: {
        ...updatedUserData,
        mobileCountry: user.mobileCountry,
        mobileNumber: user.mobileNumber,
      }
    }, { status: 200 });

    response.cookies.set('user-session', JSON.stringify(updatedUserData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Update profile error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
