import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PhotoFrame } from '../../components/PhotoFrame/PhotoFrame';
import { personalData } from '../../data/personal';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import './HeroSection.css';

export const HeroSection = ({ onNavigate }) => {
  const { scrollY } = useScrollPosition();

  const words = "Engineering the boundary between physical and digital worlds.".split(" ");

  const handleScrollClick = () => {
    const element = document.getElementById('about');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWorkClick = () => {
    const element = document.getElementById('work');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-wrapper grid-overlay">
      <div className="container hero-grid">
        <div className="hero-left">
          <span className="section-label hero-label page-transition-enter" style={{ animationDelay: '100ms' }}>
            {personalData.tagline}
          </span>

          <h1 className="hero-title">
            {words.map((word, i) => (
              <span key={i} className="word-reveal-char" style={{ animationDelay: `${300 + i * 60}ms`, marginRight: '10px' }}>
                {word}
              </span>
            ))}
          </h1>

          <div className="hero-chips-row page-transition-enter" style={{ animationDelay: '800ms' }}>
            <span className="hero-chip">[Siemens Process Simulate]</span>
            <span className="hero-chip">[NVIDIA Omniverse]</span>
            <span className="hero-chip">[BIW · BMW Standards]</span>
            <span className="hero-chip">[Digital Twin]</span>
          </div>

          <div className="hero-ctas page-transition-enter" style={{ animationDelay: '1000ms' }}>
            <button className="btn btn-primary" onClick={handleWorkClick}>View Work →</button>
            <a href={personalData.cvFile} target="_blank" rel="noopener noreferrer" className="btn btn-secondary cta-outlined">
              Download CV
            </a>
          </div>
        </div>

        <div className="hero-right page-transition-enter" style={{ animationDelay: '600ms' }}>
          <PhotoFrame src="/photo.webp" alt="Mohit Malik profile photo" />
          <div className="hero-status-row">
            <span className="status-blip pulse-dot" />
            <span>Rohtak, Haryana · Available for opportunities</span>
          </div>
        </div>
      </div>

      <div
        className="hero-scroll-indicator scroll-bounce"
        style={{ opacity: scrollY > 80 ? 0 : 1, pointerEvents: scrollY > 80 ? 'none' : 'auto' }}
        onClick={handleScrollClick}
        aria-hidden="true"
      >
        <span>scroll</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
};

export default HeroSection;
