"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function SaveUserOnAuth() {
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    if (!isSignedIn || !isLoaded || !user?.id) return;

    // Fire-and-forget: call server route to persist user data
    console.log('SaveUserOnAuth: calling /api/auth/save-user', { id: user.id });
    void fetch('/api/auth/save-user', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _clientUserId: user.id }),
    })
      .then((r) => console.log('SaveUserOnAuth: save-user response', r.status))
      .catch((e) => console.warn('SaveUserOnAuth: save-user error', e));
  }, [isSignedIn, isLoaded, user?.id]);

  return null;
}
