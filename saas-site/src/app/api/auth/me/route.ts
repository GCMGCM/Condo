import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
