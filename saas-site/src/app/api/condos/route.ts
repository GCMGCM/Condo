import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../lib/mongoose';
import Condo from '../../../models/condo';
import CondoManager from '../../../models/condo-manager';
import CondoOwner from '../../../models/condo-owner';

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
      .lean() as any[];

    // Get condos where user is an owner via CondoOwner table
    const ownerRelationships = await CondoOwner.find({ userId: session.id }).lean() as any[];
    const ownerCondoIds = ownerRelationships.map((o: any) => o.condoId);
    const ownerCondos = ownerCondoIds.length > 0
      ? await Condo.find({ _id: { $in: ownerCondoIds } }).lean() as any[]
      : [];

    // Combine and deduplicate condos
    const allCondosMap = new Map();
    
    ownedCondos.forEach((condo: any) => {
      allCondosMap.set(condo._id.toString(), {
        ...condo,
        userRole: 'manager', // User is a manager
        isManager: true,
        isOwner: false
      });
    });
    
    ownerCondos.forEach((condo: any) => {
      const condoId = condo._id.toString();
      if (allCondosMap.has(condoId)) {
        // User is both manager and owner
        const existing = allCondosMap.get(condoId);
        allCondosMap.set(condoId, {
          ...existing,
          isOwner: true // Also a fraction owner
        });
      } else {
        // User is only owner
        allCondosMap.set(condoId, {
          ...condo,
          userRole: 'owner',
          isManager: false,
          isOwner: true
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
