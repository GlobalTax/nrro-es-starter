import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotificationSound } from './useNotificationSound';

const mockPlay = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  mockPlay.mockClear();
  vi.stubGlobal('Audio', class MockAudio {
    play = mockPlay;
    volume = 0;
    currentTime = 0;
  });
});

describe('useNotificationSound', () => {
  it('calls play on each invocation', () => {
    const { result } = renderHook(() => useNotificationSound());

    act(() => result.current());
    act(() => result.current());

    expect(mockPlay).toHaveBeenCalledTimes(2);
  });

  it('does not throw if play is rejected', () => {
    mockPlay.mockRejectedValueOnce(new Error('Autoplay blocked'));

    const { result } = renderHook(() => useNotificationSound());

    expect(() => act(() => result.current())).not.toThrow();
  });

  it('returns a stable function reference', () => {
    const { result, rerender } = renderHook(() => useNotificationSound());

    const firstRef = result.current;
    rerender();
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });
});
