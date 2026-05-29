import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook to reveal elements when scrolled into viewport using IntersectionObserver.
 * Fully supports prefers-reduced-motion.
 * @param {Object} options IntersectionObserver options + triggerOnce setting
 * @returns {[React.RefObject, boolean]} Ref to bind to element, and visible state
 */
export const useScrollReveal = (options = {}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    const triggerOnce = options.triggerOnce !== false;
    const threshold = options.threshold ?? 0.15;
    const rootMargin = options.rootMargin ?? '0px';

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsRevealed(true);
        if (triggerOnce && elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      } else if (!triggerOnce) {
        setIsRevealed(false);
      }
    }, {
      threshold,
      rootMargin
    });

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options.threshold, options.rootMargin, options.triggerOnce]);

  return [elementRef, isRevealed];
};
export default useScrollReveal;
