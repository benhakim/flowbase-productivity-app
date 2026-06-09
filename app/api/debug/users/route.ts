import { NextResponse } from 'next/server';
import { db, users } from '@/db';

export async function GET() {
  try {
    const rows = await db.select().from(users).limit(50);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('debug/users error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
