'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type StepData = Record<string, unknown>;

type SessionData = {
  startedAt: number | null;
  dadosPessoais: StepData;
  senha: StepData;
  preferencias: StepData;
  nickname: string;
};

type SessionContextType = {
  session: SessionData;
  startSession: () => void;
  saveStepData: (step: keyof SessionData, data: StepData | string) => void;
  clearSession: () => void;
};

const defaultSession: SessionData = {
  startedAt: null,
  dadosPessoais: {},
  senha: {},
  preferencias: {},
  nickname: '',
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData>(() => {
    // Lazy initialization: read from sessionStorage only once on mount
    if (typeof window === 'undefined') return defaultSession;
    try {
      const saved = sessionStorage.getItem('formhell_session');
      if (saved) return JSON.parse(saved) as SessionData;
    } catch {
      // ignore parse errors
    }
    return defaultSession;
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  const saveToStorage = (newSession: SessionData) => {
    sessionStorage.setItem('formhell_session', JSON.stringify(newSession));
  };

  const startSession = () => {
    const newSession = { ...session, startedAt: Date.now() };
    setSession(newSession);
    saveToStorage(newSession);
  };

  const saveStepData = (step: keyof SessionData, data: StepData | string) => {
    const newSession = { ...session, [step]: data };
    setSession(newSession);
    saveToStorage(newSession);
  };

  const clearSession = () => {
    setSession(defaultSession);
    sessionStorage.removeItem('formhell_session');
  };

  if (!isLoaded) return null;

  return (
    <SessionContext.Provider value={{ session, startSession, saveStepData, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
