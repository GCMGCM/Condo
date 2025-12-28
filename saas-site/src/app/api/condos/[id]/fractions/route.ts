import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../../lib/mongoose';
import CondoManager from '../../../../../models/condo-manager';
import Fraction from '../../../../../models/fraction';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const { id: condoId } = await params;

    await connectToMongo();

    // Check if user is a manager
    const isManager = await CondoManager.findOne({ condoId, userId: session.id });
    if (!isManager) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const fractions = await Fraction.find({ condoId })
      .sort({ identifier: 1 })
      .lean();

    return NextResponse.json({ fractions }, { status: 200 });
  } catch (err) {
    console.error('Get fractions error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const { id: condoId } = await params;

    await connectToMongo();

    // Check if user is a manager
    const isManager = await CondoManager.findOne({ condoId, userId: session.id });
    if (!isManager) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      identifier,
      ownerFullName,
      ownerEmail,
      ownerCountryMobile,
      ownerMobile,
      ownershipShare,
      addressLine1,
      addressLine2,
      postalCode,
      country,
    } = body;

    if (!identifier || !ownerFullName || !ownerEmail) {
      return NextResponse.json({ 
        message: 'Identifier, owner name, and owner email are required' 
      }, { status: 400 });
    }

    const fraction = new Fraction({
      condoId,
      identifier: identifier.trim(),
      ownerFullName: ownerFullName.trim(),
      ownerEmail: ownerEmail.trim().toLowerCase(),
      ownerCountryMobile: ownerCountryMobile?.trim() || '',
      ownerMobile: ownerMobile?.trim() || '',
      ownershipShare: ownershipShare || 0,
      addressLine1: addressLine1?.trim() || '',
      addressLine2: addressLine2?.trim() || '',
      postalCode: postalCode?.trim() || '',
      country: country?.trim() || '',
    });

    await fraction.save();

    return NextResponse.json({ 
      message: 'Fraction created successfully',
      fraction 
    }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ 
        message: 'A fraction with this identifier already exists in this condo' 
      }, { status: 409 });
    }
    console.error('Create fraction error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
