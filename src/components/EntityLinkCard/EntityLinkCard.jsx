import React from 'react';
import { ArrowRight } from 'lucide-react';
import './EntityLinkCard.css';

export const EntityLinkCard = ({ title, date, desc, to, onNavigate }) => {
  const handleClick = () => {
    if (onNavigate) onNavigate(to);
  };

  return (
    <div 
      className="entity-link-card" 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="entity-link-header">
        <h4 className="entity-link-title">{title}</h4>
        {date && <span className="entity-link-date">{date}</span>}
      </div>
      <p className="entity-link-desc">{desc}</p>
      <div className="entity-link-action">
        <span>Full Story</span>
        <ArrowRight size={14} />
      </div>
    </div>
  );
};

export default EntityLinkCard;
