import { useRef, useCallback } from 'react';

/** Reutiliza una sola instancia de Audio para evitar fugas de memoria */
export function useNotificationSound(src = '/notification.mp3', volume = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.volume = volume;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Browser blocked autoplay
      });
    } catch {
      // Audio API not available
    }
  }, [src, volume]);

  return play;
}
