import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCountUp } from '../../hooks/useCountUp';
import './StatBlock.css';

export const StatBlock = ({ value, label, sub }) => {
  const [ref, isRevealed] = useScrollReveal({ threshold: 0.1, triggerOnce: true });
  const count = useCountUp(value, 1200, isRevealed);

  return (
    <div className="stat-block" ref={ref}>
      <span className="stat-number">{count}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
};

export default StatBlock;
