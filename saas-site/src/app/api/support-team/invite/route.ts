import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../lib/mongoose';
import SupportInvite from '../../../../models/support-invite';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    // Only admins can invite support team members
    if (!session.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { email, fullName } = body;

    if (!email || !fullName) {
      return NextResponse.json({ message: 'Email and full name required' }, { status: 400 });
    }

    await connectToMongo();

    // Check if invite already exists
    const existing = await SupportInvite.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ message: 'Invite already exists for this email' }, { status: 409 });
    }

    // Create invite
    const invite = new SupportInvite({
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      invitedBy: session.email,
    });

    await invite.save();

    return NextResponse.json({ 
      message: 'Team member invited successfully',
      invite: {
        email: invite.email,
        fullName: invite.fullName,
      }
    }, { status: 201 });
  } catch (err) {
    console.error('Invite support team error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    // Only admins and support team can view invites
    if (!session.isAdmin && !session.isSupportTeam) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await connectToMongo();

    const invites = await SupportInvite.find({ used: false }).lean();

    return NextResponse.json({ invites }, { status: 200 });
  } catch (err) {
    console.error('Get invites error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
