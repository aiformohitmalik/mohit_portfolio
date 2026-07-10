import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { SkillDomainCard } from '../../components/SkillDomainCard/SkillDomainCard';
import { skillsData, skillLegend } from '../../data/skills';
import './SkillsSection.css';

export const SkillsSection = ({ onNavigate }) => {
  return (
    <section id="skills" className="section container" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <SectionHeading num="04" title="Physical AI Skill Map" />

      {/* Skills Grid */}
      <div className="skills-grid">
        {skillsData.map((domain, idx) => (
          <SkillDomainCard
            key={domain.category}
            category={domain.category}
            proficiency={domain.proficiency}
            classColor={domain.classColor}
            tagline={domain.tagline}
            skills={domain.skills}
            index={idx}
          />
        ))}
      </div>

      {/* Skills Footer (Legend + Deep Page Link) */}
      <div className="skills-footer-row">
        <div className="skills-legend">
          {skillLegend.map((item) => (
            <span key={item.rating} className="skills-legend-chip">
              <span style={{ color: 'var(--amber-primary)', marginRight: '4px' }}>
                {'●'.repeat(item.rating)}{'○'.repeat(5 - item.rating)}
              </span>
              {item.label}
            </span>
          ))}
        </div>

        <span
          onClick={() => onNavigate('/internships')}
          className="redirect-cta-btn"
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('/internships'); } }}
        >
          <span>See Full Certifications & Learning Path</span>
          <ArrowRight size={14} />
        </span>
      </div>
    </section>
  );
};

export default SkillsSection;
