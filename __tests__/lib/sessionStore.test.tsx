import { renderHook, act } from '@testing-library/react';
import { SessionProvider, useSession } from '@/lib/sessionStore';
import React from 'react';

describe('sessionStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider>{children}</SessionProvider>
  );

  it('should start session and save to storage', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.startSession();
    });

    expect(result.current.session.startedAt).not.toBeNull();
    const stored = JSON.parse(sessionStorage.getItem('formhell_session') || '{}');
    expect(stored.startedAt).toBe(result.current.session.startedAt);
  });

  it('should save step data', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.saveStepData('dadosPessoais', { name: 'Test' });
    });

    expect(result.current.session.dadosPessoais).toEqual({ name: 'Test' });
    const stored = JSON.parse(sessionStorage.getItem('formhell_session') || '{}');
    expect(stored.dadosPessoais).toEqual({ name: 'Test' });
  });

  it('should clear session', () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.startSession();
      result.current.clearSession();
    });

    expect(result.current.session.startedAt).toBeNull();
    expect(sessionStorage.getItem('formhell_session')).toBeNull();
  });
});
