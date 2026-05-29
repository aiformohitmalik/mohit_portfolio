import React from 'react';
import './PhotoFrame.css';

export const PhotoFrame = ({ src, alt }) => {
  return (
    <div className="photo-frame-container">
      {/* Background dot grid decor */}
      <div className="photo-dot-grid" />

      {/* Actual photo card with Irregular clip-path */}
      <div className="photo-card">
        <img 
          src={src || "/photo.webp"} 
          alt={alt || "Profile headshot"} 
          className="photo-card-img" 
          loading="lazy"
        />
        <div className="photo-card-overlay" />
      </div>

      {/* SVG Outline Border Trace overlay */}
      <svg 
        className="photo-frame-svg" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path 
          className="photo-frame-border" 
          d="M 1,1 L 90,1 L 99,10 L 99,99 L 10,99 L 1,90 Z"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default PhotoFrame;
