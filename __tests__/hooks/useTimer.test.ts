import { renderHook } from '@testing-library/react';
import { useTimer } from '@/hooks/useTimer';
import { useSession } from '@/lib/sessionStore';

// Mock the useSession hook
jest.mock('@/lib/sessionStore', () => ({
  useSession: jest.fn(),
}));

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should not run if session not started', () => {
    (useSession as jest.Mock).mockReturnValue({ session: { startedAt: null } });
    const { result } = renderHook(() => useTimer());
    expect(result.current.isRunning).toBe(false);
    expect(result.current.elapsed).toBe(0);
    expect(result.current.formattedTime).toBe('00:00');
  });

  it('should run and update time if session started', () => {
    const mockStartedAt = Date.now();
    (useSession as jest.Mock).mockReturnValue({ session: { startedAt: mockStartedAt } });
    const { result } = renderHook(() => useTimer());

    expect(result.current.isRunning).toBe(true);
    expect(result.current.formattedTime).toMatch(/\d{2}:\d{2}/);
  });
});
