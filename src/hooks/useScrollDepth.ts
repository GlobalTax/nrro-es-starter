import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export const useScrollDepth = () => {
  const { trackScrollDepth } = useAnalytics();
  const depthsTracked = useRef<Set<number>>(new Set());
  const currentPath = useRef(window.location.pathname);

  useEffect(() => {
    // Reset tracked depths when page changes
    if (currentPath.current !== window.location.pathname) {
      depthsTracked.current.clear();
      currentPath.current = window.location.pathname;
    }

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      // Thresholds to track
      const thresholds = [25, 50, 75, 90, 100];
      
      thresholds.forEach((threshold) => {
        if (
          scrollPercentage >= threshold &&
          !depthsTracked.current.has(threshold)
        ) {
          depthsTracked.current.add(threshold);
          trackScrollDepth(
            threshold as 25 | 50 | 75 | 90 | 100,
            window.location.pathname
          );
        }
      });
    };

    // Throttle for performance optimization
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [trackScrollDepth]);
};
