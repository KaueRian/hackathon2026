'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SessionData = {
  startedAt: number | null;
  dadosPessoais: any;
  senha: any;
  preferencias: any;
  nickname: string;
};

type SessionContextType = {
  session: SessionData;
  startSession: () => void;
  saveStepData: (step: keyof SessionData, data: any) => void;
  clearSession: () => void;
};

const defaultSession: SessionData = {
  startedAt: null,
  dadosPessoais: {},
  senha: {},
  preferencias: {},
  nickname: ''
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData>(defaultSession);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('formhell_session');
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse session data');
      }
    }
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

  const saveStepData = (step: keyof SessionData, data: any) => {
    const newSession = { ...session, [step]: data };
    setSession(newSession);
    saveToStorage(newSession);
  };

  const clearSession = () => {
    setSession(defaultSession);
    sessionStorage.removeItem('formhell_session');
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

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
