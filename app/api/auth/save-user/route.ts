import { NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { db, users } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const clientBody = await request.json().catch(() => null);

  let userId: string | null = null;
  try {
    const auth = getAuth(request as any);
    userId = auth?.userId ?? clientBody?._clientUserId ?? null;
  } catch (e) {
    console.warn('save-user: getAuth(request) failed, falling back to client body');
    userId = clientBody?._clientUserId ?? null;
  }

  console.log('save-user POST called', { userId, clientBody });

  if (!userId) {
    console.warn('save-user: no userId available');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const email = user.emailAddresses?.[0]?.emailAddress || (user.primaryEmailAddress as any)?.emailAddress;
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.fullName || user.username || null;

    console.log('save-user: resolved clerk user', { id: user.id, email, name });

    if (!email) {
      console.warn('save-user: user has no email', { id: user.id });
      return NextResponse.json({ error: 'No email available for user' }, { status: 400 });
    }

    // Only insert if a user with this email doesn't already exist
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length === 0) {
      const result = await db.insert(users).values({ name, email });
      console.log('save-user: inserted user', { email, name, result });
    } else {
      console.log('save-user: user already exists', { email });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('save-user error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
