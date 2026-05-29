import { useEffect, useState } from 'react';

/**
 * Custom hook to track scroll Y offset and page-level scroll percentage.
 * Utilizes passive listeners to maintain highly responsive framerates.
 * @returns {Object} { scrollY, scrollPercent }
 */
export const useScrollPosition = () => {
  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    scrollPercent: 0
  });

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      const currentScrollY = window.scrollY;
      
      // Calculate total page scroll height boundaries
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const totalScrollable = documentHeight - windowHeight;
      
      const currentPercent = totalScrollable > 0 
        ? (currentScrollY / totalScrollable) * 100 
        : 0;

      setScrollState({
        scrollY: currentScrollY,
        scrollPercent: Math.min(Math.max(currentPercent, 0), 100)
      });
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updatePosition(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollState;
};

export default useScrollPosition;
