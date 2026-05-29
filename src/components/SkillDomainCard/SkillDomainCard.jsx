import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './SkillDomainCard.css';

export const SkillDomainCard = ({ category, proficiency, classColor, tagline, skills, index }) => {
  const [ref, isRevealed] = useScrollReveal({ threshold: 0.1, triggerOnce: true });

  const renderDots = (rating) => {
    const filled = '●'.repeat(rating);
    const empty = '○'.repeat(5 - rating);
    return filled + empty;
  };

  const getAccentClass = () => {
    if (classColor.includes('amber')) return 'amber';
    if (classColor.includes('blue')) return 'blue';
    if (classColor.includes('green')) return 'green';
    return 'purple';
  };

  const accent = getAccentClass();

  return (
    <div
      className={`skill-card skill-card-border-${accent} skill-card-hover ${isRevealed ? 'reveal-card' : ''}`}
      ref={ref}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="skill-card-header">
        <div className="skill-card-title">
          <h3>{category}</h3>
          <span className={`badge-solid ${classColor}`}>{proficiency}</span>
        </div>
        <span className="skill-card-desc">{tagline}</span>
      </div>
      
      <div className="skill-chips-container">
        {skills.map((skill) => (
          <div key={skill.name} className="skill-chip">
            <span>{skill.name}</span>
            <span className={`skill-dots dots-${accent}`}>
              {renderDots(skill.rating)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDomainCard;
