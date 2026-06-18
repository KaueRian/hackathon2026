'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from '@/lib/sessionStore';

export function useTimer() {
  const { session } = useSession();
  const [elapsed, setElapsed] = useState(0);

  // Derive isRunning from session state instead of setting it in an effect
  const isRunning = useMemo(() => !!session.startedAt, [session.startedAt]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && session.startedAt) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - session.startedAt!) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, session.startedAt]);

  const stopTimer = () => {
    return elapsed;
  };

  const formattedTime = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;

  return { elapsed, formattedTime, isRunning, stopTimer };
}
