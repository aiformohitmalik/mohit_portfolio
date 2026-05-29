import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import './ContactTile.css';

export const ContactTile = ({ type, iconName, label, value, href }) => {
  const [copied, setCopied] = useState(false);
  const IconComponent = Icons[iconName] || Icons.HelpCircle;

  const handleClick = (e) => {
    if (type === 'email') {
      e.preventDefault();
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const content = (
    <>
      <div className="contact-tile-icon">
        <IconComponent size={20} />
      </div>
      <div className="contact-tile-content">
        <span className="contact-tile-label">{label}</span>
        <span className="contact-tile-value">{value}</span>
      </div>
      {type === 'email' && (
        <span className={`copy-tooltip ${copied ? 'copy-tooltip-visible' : ''}`}>
          Copied!
        </span>
      )}
    </>
  );

  if (type === 'email') {
    return (
      <div 
        className="contact-tile" 
        onClick={handleClick} 
        role="button" 
        tabIndex={0} 
        onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
      >
        {content}
      </div>
    );
  }

  return (
    <a 
      href={href} 
      target={type === 'link' ? '_blank' : undefined} 
      rel={type === 'link' ? 'noopener noreferrer' : undefined} 
      className="contact-tile"
    >
      {content}
    </a>
  );
};

export default ContactTile;
