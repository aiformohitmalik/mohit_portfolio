import { useEffect, useState } from 'react';

/**
 * Animated number counter using requestAnimationFrame.
 * Detects prefixes (like ₹) and suffixes (like + or L) automatically.
 * @param {string|number} target The target count value (e.g. "₹16L" or "60+")
 * @param {number} duration Duration of the count animation in ms
 * @param {boolean} trigger Whether to trigger/start the counting process
 * @returns {string|number} Current counting state
 */
export const useCountUp = (target, duration = 1200, trigger = false) => {
  const [count, setCount] = useState("0");

  useEffect(() => {
    if (!trigger) {
      setCount("0");
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }

    const targetStr = String(target);
    const numMatch = targetStr.match(/(\d+)/);
    if (!numMatch) {
      setCount(target);
      return;
    }

    const numberValue = parseInt(numMatch[0], 10);
    const prefix = targetStr.substring(0, numMatch.index);
    const suffix = targetStr.substring(numMatch.index + numMatch[0].length);

    let startTimestamp = null;
    let rafId;

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * numberValue);

      setCount(`${prefix}${currentVal}${suffix}`);

      if (elapsed < duration) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    rafId = window.requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, trigger]);

  return count;
};

export default useCountUp;
