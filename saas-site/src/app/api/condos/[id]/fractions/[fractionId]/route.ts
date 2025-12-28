import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../../../lib/mongoose';
import CondoManager from '../../../../../../models/condo-manager';
import Fraction from '../../../../../../models/fraction';

export async function GET(
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

    const fraction = await Fraction.findById(fractionId).lean();

    if (!fraction || fraction.condoId.toString() !== condoId) {
      return NextResponse.json({ message: 'Fraction not found' }, { status: 404 });
    }

    return NextResponse.json({ fraction }, { status: 200 });
  } catch (err) {
    console.error('Get fraction error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
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

    const fraction = await Fraction.findById(fractionId);

    if (!fraction || fraction.condoId.toString() !== condoId) {
      return NextResponse.json({ message: 'Fraction not found' }, { status: 404 });
    }

    // Update fields
    if (identifier) fraction.identifier = identifier.trim();
    if (ownerFullName) fraction.ownerFullName = ownerFullName.trim();
    if (ownerEmail) fraction.ownerEmail = ownerEmail.trim().toLowerCase();
    if (ownerCountryMobile !== undefined) fraction.ownerCountryMobile = ownerCountryMobile.trim();
    if (ownerMobile !== undefined) fraction.ownerMobile = ownerMobile.trim();
    if (ownershipShare !== undefined) fraction.ownershipShare = ownershipShare;
    if (addressLine1 !== undefined) fraction.addressLine1 = addressLine1.trim();
    if (addressLine2 !== undefined) fraction.addressLine2 = addressLine2.trim();
    if (postalCode !== undefined) fraction.postalCode = postalCode.trim();
    if (country !== undefined) fraction.country = country.trim();

    fraction.updatedAt = new Date();
    await fraction.save();

    return NextResponse.json({ message: 'Fraction updated successfully', fraction }, { status: 200 });
  } catch (err) {
    console.error('Update fraction error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
