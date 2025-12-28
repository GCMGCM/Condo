import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../lib/mongoose';
import Condo from '../../../models/condo';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    await connectToMongo();

    // Get all condos for this user
    const condos = await Condo.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ condos }, { status: 200 });
  } catch (err) {
    console.error('Get condos error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const body = await req.json();
    const { name, type, addressLine1, addressLine2, postalCode, country, condoEmail } = body;

    if (!name || !type) {
      return NextResponse.json({ message: 'Condo name and type are required' }, { status: 400 });
    }

    await connectToMongo();

    const condo = new Condo({
      name: name.trim(),
      type: type.trim(),
      addressLine1: addressLine1?.trim() || '',
      addressLine2: addressLine2?.trim() || '',
      postalCode: postalCode?.trim() || '',
      country: country?.trim() || '',
      condoEmail: condoEmail?.trim() || '',
      userId: session.id,
    });

    await condo.save();

    return NextResponse.json({ 
      message: 'Condo created successfully',
      condo: {
        _id: condo._id.toString(),
        name: condo.name,
        avatar: condo.avatar,
        lastActivityAt: condo.lastActivityAt,
        createdAt: condo.createdAt,
      }
    }, { status: 201 });
  } catch (err) {
    console.error('Create condo error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
