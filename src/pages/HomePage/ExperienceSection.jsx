import React from 'react';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { ExperienceTimeline } from '../../components/ExperienceTimeline/ExperienceTimeline';
import { experienceData } from '../../data/experience';
import './ExperienceSection.css';

export const ExperienceSection = ({ onNavigate }) => {
  return (
    <section id="work" className="section container experience-container" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <SectionHeading num="03" title="Professional Experience" />
      <ExperienceTimeline 
        experience={experienceData} 
        onNavigate={onNavigate} 
      />
    </section>
  );
};

export default ExperienceSection;
