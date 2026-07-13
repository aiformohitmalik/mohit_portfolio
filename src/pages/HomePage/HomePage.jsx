import React from 'react';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { EducationSection } from './EducationSection';
import { ContactSection } from './ContactSection';

export const HomePage = ({ onNavigate, weather }) => {
  return (
    <div className="page-transition-enter">
      <HeroSection onNavigate={onNavigate} weather={weather} />
      <AboutSection onNavigate={onNavigate} />
      <ExperienceSection onNavigate={onNavigate} />
      <SkillsSection onNavigate={onNavigate} />
      <EducationSection onNavigate={onNavigate} />
      <ContactSection onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;
