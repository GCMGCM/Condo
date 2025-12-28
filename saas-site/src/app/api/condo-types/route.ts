import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../../lib/mongoose';
import CondoType from '../../../models/condo-type';

export async function GET(req: NextRequest) {
  try {
    await connectToMongo();

    const types = await CondoType.find().sort({ name: 1 }).lean();

    return NextResponse.json({ types }, { status: 200 });
  } catch (err) {
    console.error('Get condo types error:', err);
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
    
    if (!session.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ message: 'Type name is required' }, { status: 400 });
    }

    await connectToMongo();

    const type = new CondoType({ name: name.trim() });
    await type.save();

    return NextResponse.json({ 
      message: 'Condo type created',
      type 
    }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ message: 'Type already exists' }, { status: 409 });
    }
    console.error('Create condo type error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    
    if (!session.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Type ID required' }, { status: 400 });
    }

    await connectToMongo();

    await CondoType.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Type deleted' }, { status: 200 });
  } catch (err) {
    console.error('Delete condo type error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
