import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../../lib/mongoose';
import CondoManager from '../../../../../models/condo-manager';
import CondoManagerInvite from '../../../../../models/condo-manager-invite';
import User from '../../../../../models/user';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const condoId = params.id;

    await connectToMongo();

    // Check if user is a manager
    const isManager = await CondoManager.findOne({ condoId, userId: session.id });
    if (!isManager) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const managers = await CondoManager.find({ condoId })
      .populate('userId', 'fullName email')
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ managers }, { status: 200 });
  } catch (err) {
    console.error('Get managers error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const condoId = params.id;

    await connectToMongo();

    // Check if user is a manager
    const isManager = await CondoManager.findOne({ condoId, userId: session.id });
    if (!isManager) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      // User exists - add directly
      const existing = await CondoManager.findOne({ condoId, userId: user._id });
      if (existing) {
        return NextResponse.json({ message: 'User is already a manager' }, { status: 409 });
      }

      const manager = new CondoManager({
        condoId,
        userId: user._id,
        invitedBy: session.id,
      });
      await manager.save();

      return NextResponse.json({ message: 'Manager added' }, { status: 201 });
    } else {
      // User doesn't exist - create invite
      const invite = new CondoManagerInvite({
        condoId,
        email: email.toLowerCase().trim(),
        invitedBy: session.id,
      });
      await invite.save();

      return NextResponse.json({ message: 'Invite sent. User will become manager after signup.' }, { status: 201 });
    }
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ message: 'Invite already sent' }, { status: 409 });
    }
    console.error('Invite manager error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
