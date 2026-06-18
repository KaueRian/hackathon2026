'use client';

import React, { createContext, useContext, useState, useSyncExternalStore, ReactNode } from 'react';

type SessionData = {
  startedAt: number | null;
  currentStep: number;
  dadosPessoais: {
    nome?: string;
    email?: string;
    dataNascimento?: string;
    genero?: string;
    telefone?: string;
  };
  senha: {
    senha?: string;
    perguntaSeguranca?: string;
  };
  preferencias: {
    cores?: Record<string, number>;
    newsletter?: boolean;
    termos?: boolean;
    avaliacao?: number;
    avatar?: string;
  };
  nickname: string;
};

type SessionContextType = {
  session: SessionData;
  startSession: () => void;
  saveStepData: (step: keyof SessionData, data: unknown) => void;
  setCurrentStep: (step: number) => void;
  clearSession: () => void;
  getElapsedSeconds: () => number;
};

const defaultSession: SessionData = {
  startedAt: null,
  currentStep: 0,
  dadosPessoais: {},
  senha: {},
  preferencias: {},
  nickname: ''
};

function loadSessionFromStorage(): SessionData {
  if (typeof window === 'undefined') return defaultSession;
  const saved = sessionStorage.getItem('formhell_session');
  if (saved) {
    try {
      return JSON.parse(saved) as SessionData;
    } catch {
      console.error('Failed to parse session data');
    }
  }
  return defaultSession;
}

// Use useSyncExternalStore to detect client-side hydration without setState in effect
function subscribeToNothing() { return () => {}; }
function getIsClient() { return true; }
function getIsServer() { return false; }

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(subscribeToNothing, getIsClient, getIsServer);

  // Initialize from storage via lazy initializer (no effect needed)
  const [session, setSession] = useState<SessionData>(loadSessionFromStorage);

  const saveToStorage = (newSession: SessionData) => {
    sessionStorage.setItem('formhell_session', JSON.stringify(newSession));
  };

  const startSession = () => {
    const newSession = { ...defaultSession, startedAt: Date.now(), currentStep: 1 };
    setSession(newSession);
    saveToStorage(newSession);
  };

  const saveStepData = (step: keyof SessionData, data: unknown) => {
    const newSession = { ...session, [step]: data };
    setSession(newSession as SessionData);
    saveToStorage(newSession as SessionData);
  };

  const setCurrentStep = (step: number) => {
    const newSession = { ...session, currentStep: step };
    setSession(newSession);
    saveToStorage(newSession);
  };

  const clearSession = () => {
    setSession(defaultSession);
    sessionStorage.removeItem('formhell_session');
  };

  const getElapsedSeconds = () => {
    if (!session.startedAt) return 0;
    return Math.floor((Date.now() - session.startedAt) / 1000);
  };

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <SessionContext.Provider value={{ session, startSession, saveStepData, setCurrentStep, clearSession, getElapsedSeconds }}>
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
