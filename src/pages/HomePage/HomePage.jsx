import React, { useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { EducationSection } from './EducationSection';
import { ContactSection } from './ContactSection';

export const HomePage = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="page-transition-enter">
      <HeroSection onNavigate={onNavigate} />
      <AboutSection onNavigate={onNavigate} />
      <ExperienceSection onNavigate={onNavigate} />
      <SkillsSection onNavigate={onNavigate} />
      <EducationSection onNavigate={onNavigate} />
      <ContactSection onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;
