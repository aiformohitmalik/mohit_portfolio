import React, { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import './Accordion.css';

export const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const triggerId = `accordion-trigger-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div className="accordion-item">
      <button
        id={triggerId}
        className="accordion-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
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
        id={panelId}
        className={`accordion-panel ${isOpen ? 'accordion-panel-expanded' : ''}`}
        role="region"
        aria-labelledby={triggerId}
      >
        <div className="accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
