import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../../../../lib/mongoose';
import CondoManager from '../../../../../../../models/condo-manager';
import Fraction from '../../../../../../../models/fraction';
import User from '../../../../../../../models/user';
import CondoOwner from '../../../../../../../models/condo-owner';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fractionId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const { id: condoId, fractionId } = await params;

    await connectToMongo();

    // Check if user is a manager
    const isManager = await CondoManager.findOne({ condoId, userId: session.id });
    if (!isManager) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const fraction = await Fraction.findById(fractionId);

    if (!fraction || fraction.condoId.toString() !== condoId) {
      return NextResponse.json({ message: 'Fraction not found' }, { status: 404 });
    }

    if (fraction.ownerInvited) {
      return NextResponse.json({ message: 'Owner already invited' }, { status: 409 });
    }

    // Check if owner email exists as a user
    const existingUser = await User.findOne({ email: fraction.ownerEmail.toLowerCase() });

    if (existingUser) {
      // User exists - link them and mark as accepted
      fraction.ownerInvited = true;
      fraction.ownerAccepted = true;
      fraction.ownerUserId = existingUser._id;
      
      // Create CondoOwner relationship (if not already exists)
      await CondoOwner.findOneAndUpdate(
        { condoId, userId: existingUser._id },
        { 
          condoId,
          userId: existingUser._id,
          invitedBy: session.id,
          createdAt: new Date()
        },
        { upsert: true }
      );
    } else {
      // User doesn't exist - just mark as invited (they need to sign up)
      fraction.ownerInvited = true;
      fraction.ownerAccepted = false;
    }

    fraction.updatedAt = new Date();
    await fraction.save();

    return NextResponse.json({ 
      message: existingUser 
        ? 'Owner linked successfully (user already exists)' 
        : 'Invitation sent. Owner will be linked when they sign up.',
      fraction 
    }, { status: 200 });
  } catch (err) {
    console.error('Invite owner error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
