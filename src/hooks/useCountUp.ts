import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  startOnView?: boolean;
}

export const useCountUp = ({ 
  end, 
  duration = 2000,
  startOnView = true 
}: UseCountUpOptions) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if ((startOnView && isInView && !hasStarted) || (!startOnView && !hasStarted)) {
      setHasStarted(true);
      
      const startTime = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        
        // Easing function para hacer la animación más suave
        const easeOutQuad = (t: number) => t * (2 - t);
        const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuad(progress));
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration, startOnView, hasStarted]);

  return { count, ref };
};
