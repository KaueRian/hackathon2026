'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/sessionStore';

export function useTimer() {
  const { session } = useSession();
  const [elapsed, setElapsed] = useState(0);

  // Derive isRunning directly from session state — no extra setState needed
  const isRunning = session.startedAt !== null;

  useEffect(() => {
    if (!isRunning || !session.startedAt) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - session.startedAt!) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, session.startedAt]);

  const formattedTime = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;

  return { elapsed, formattedTime, isRunning };
}
