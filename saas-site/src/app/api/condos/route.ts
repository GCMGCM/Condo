import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../lib/mongoose';
import Condo from '../../../models/condo';
import CondoManager from '../../../models/condo-manager';
import Fraction from '../../../models/fraction';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    await connectToMongo();

    // Get condos where user is the creator
    const ownedCondos = await Condo.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .lean();

    // Get condos where user owns a fraction
    const fractions = await Fraction.find({ 
      ownerUserId: session.id,
      ownerAccepted: true 
    }).lean();
    
    const fractionCondoIds = fractions.map(f => f.condoId);
    const fractionCondos = fractionCondoIds.length > 0
      ? await Condo.find({ _id: { $in: fractionCondoIds } }).lean()
      : [];

    // Combine and deduplicate condos
    const allCondosMap = new Map();
    
    ownedCondos.forEach(condo => {
      allCondosMap.set(condo._id.toString(), {
        ...condo,
        userRole: 'manager' // User is a manager
      });
    });
    
    fractionCondos.forEach(condo => {
      const condoId = condo._id.toString();
      if (!allCondosMap.has(condoId)) {
        allCondosMap.set(condoId, {
          ...condo,
          userRole: 'owner' // User is a fraction owner
        });
      }
    });

    const condos = Array.from(allCondosMap.values());

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

    // Add creator as condo manager
    const manager = new CondoManager({
      condoId: condo._id,
      userId: session.id,
      invitedBy: session.id,
    });
    await manager.save();

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
