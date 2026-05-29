import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Accordion.css';

export const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <button
        className="accordion-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="accordion-title-wrap">
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>{title}</h3>
        </div>
        <ChevronDown 
          size={18} 
          className={`accordion-icon-chevron ${isOpen ? 'accordion-icon-chevron-rotated' : ''}`} 
        />
      </button>
      <div 
        className={`accordion-panel ${isOpen ? 'accordion-panel-expanded' : ''}`}
        role="region"
      >
        <div className="accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
