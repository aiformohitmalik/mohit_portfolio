import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { educationData } from '../../data/education';
import './EducationSection.css';

export const EducationSection = ({ onNavigate }) => {
  const { primary, secondary } = educationData;

  return (
    <section id="education" className="section container" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <SectionHeading num="05" title="Academic Credentials" />

      <div className="education-grid">
        {/* Left Column: Primary B.Tech Degree Card */}
        <div className="education-primary-card">
          <div className="education-header-row">
            <div className="education-title-group">
              <span className="education-degree">{primary.degree}</span>
              <span className="education-inst">{primary.institution}</span>
              <span className="caption-text" style={{ fontStyle: 'italic', marginTop: '4px' }}>
                {primary.accreditation}
              </span>
            </div>
            <span className="education-date">{primary.duration}</span>
          </div>

          <div className="education-highlights-list">
            {primary.highlights.map((h, i) => (
              <div key={i} className="education-highlight-item">
                <span>{h}</span>
              </div>
            ))}
          </div>

          <p className="caption-text" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {primary.note}
          </p>

          {/* Hashed Link to Campus Story */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
            <span
              onClick={() => onNavigate(primary.campusLink)}
              className="redirect-cta-btn"
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate(primary.campusLink); } }}
            >
              <span>Campus Story: NCC · Karate · Student of the Year</span>
              <ArrowRight size={14} />
            </span>
          </div>
        </div>

        {/* Right Column: Secondary Schooling */}
        <div className="education-secondary-panel">
          {secondary.map((school, idx) => (
            <div key={idx} className="education-secondary-card">
              <div className="education-secondary-header">
                <span className="education-secondary-title">{school.level}</span>
                <span className="education-date">{school.duration}</span>
              </div>
              <div className="education-secondary-school">
                <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{school.school}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{school.location} ({school.board})</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
