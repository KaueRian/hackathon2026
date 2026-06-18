'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/sessionStore';

export function useTimer() {
  const { session } = useSession();
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (session.startedAt) {
      setIsRunning(true);
    }
  }, [session.startedAt]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && session.startedAt) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - session.startedAt!) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, session.startedAt]);

  const stopTimer = () => {
    setIsRunning(false);
    return elapsed;
  };

  const formattedTime = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;

  return { elapsed, formattedTime, isRunning, stopTimer };
}
