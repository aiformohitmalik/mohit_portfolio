import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './SectionHeading.css';

export const SectionHeading = ({ num, title }) => {
  const [ref, isRevealed] = useScrollReveal({ threshold: 0.1, triggerOnce: true });

  return (
    <div className="section-heading-container" ref={ref}>
      <span className="section-label">{num}</span>
      <div className="section-title-wrap">
        <h2>{title}</h2>
      </div>
      <div className={`section-accent-line ${isRevealed ? 'scale-line-enter' : ''}`} />
    </div>
  );
};

export default SectionHeading;
