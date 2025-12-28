import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../../lib/mongoose';
import Condo from '../../../../models/condo';
import CondoManager from '../../../../models/condo-manager';
import Fraction from '../../../../models/fraction';

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

    // Check if user is a manager of this condo
    const isManager = await CondoManager.findOne({
      condoId: condoId,
      userId: session.id,
    });

    if (!isManager) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const condo = await Condo.findById(condoId).lean();

    if (!condo) {
      return NextResponse.json({ message: 'Condo not found' }, { status: 404 });
    }

    // Check if user also owns a fraction
    const isOwner = await Fraction.findOne({
      condoId,
      ownerUserId: session.id,
      ownerAccepted: true
    }).lean();

    return NextResponse.json({ 
      condo, 
      isManager: true,
      isOwner: !!isOwner 
    }, { status: 200 });
  } catch (err) {
    console.error('Get condo error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const isManager = await CondoManager.findOne({
      condoId: condoId,
      userId: session.id,
    });

    if (!isManager) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const body = await req.json();
    const { name, type, addressLine1, addressLine2, postalCode, country, condoEmail } = body;

    const condo = await Condo.findById(condoId);

    if (!condo) {
      return NextResponse.json({ message: 'Condo not found' }, { status: 404 });
    }

    // Update fields
    if (name) condo.name = name.trim();
    if (type) condo.type = type.trim();
    if (addressLine1 !== undefined) condo.addressLine1 = addressLine1.trim();
    if (addressLine2 !== undefined) condo.addressLine2 = addressLine2.trim();
    if (postalCode !== undefined) condo.postalCode = postalCode.trim();
    if (country !== undefined) condo.country = country.trim();
    if (condoEmail !== undefined) condo.condoEmail = condoEmail.trim();

    await condo.save();

    return NextResponse.json({ message: 'Condo updated successfully', condo }, { status: 200 });
  } catch (err) {
    console.error('Update condo error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
