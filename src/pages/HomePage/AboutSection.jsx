import React from 'react';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { StatBlock } from '../../components/StatBlock/StatBlock';
import { personalData } from '../../data/personal';
import './AboutSection.css';

export const AboutSection = ({ onNavigate }) => {
  return (
    <section id="about" className="section container" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <SectionHeading num="02" title="Engineer with a Builder's Instinct" />

      <div className="about-grid">
        {/* Left Column: Stat Panel */}
        <div className="about-stats-panel">
          {personalData.quickStats.map((stat, idx) => (
            <StatBlock 
              key={idx}
              value={stat.value}
              label={stat.label}
              sub={stat.sub}
            />
          ))}
        </div>

        {/* Right Column: Narrative */}
        <div className="about-narrative">
          <p className="about-paragraph">
            I engineer the interface between physical manufacturing and digital simulation. At <strong>EDAG PS India</strong>, I started with BIW production cells built to BMW precision standards — designing fixtures, validating robot paths, and eliminating collisions before they reach the floor. Since January 2026, I've moved deeper into digital twin territory: Omniverse environments, USD-based modular workflows, and Gaussian Splatting for 3D reconstruction.
          </p>
          <p className="about-paragraph">
            Before EDAG, I spent three years building <strong>Ground Rebotics</strong> from scratch — government-funded, nationally recognized, and incubated at AIC, IIT Delhi. I raised ₹16L in grants, led cross-functional teams, and learned what it means to build something real under pressure. I also founded <strong>iConnect</strong> at my university — a 60-member entrepreneurship society that's now the institution's official innovation body. It survived its founder. That matters to me.
          </p>

          {/* Quick Links Row */}
          <span className="about-quick-links-title">Quick Links</span>
          <div className="about-quick-links">
            <span
              className="about-link-chip badge-solid badge-amber"
              onClick={() => onNavigate('/ground-rebotics')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('/ground-rebotics'); } }}
            >
              → The Founder Years
            </span>
            <span
              className="about-link-chip badge-solid badge-purple"
              onClick={() => onNavigate('/iconnect')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('/iconnect'); } }}
            >
              → iConnect Story
            </span>
            <span
              className="about-link-chip badge-solid badge-green"
              onClick={() => onNavigate('/campus')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('/campus'); } }}
            >
              → Honours & Awards
            </span>
            <a 
              href={personalData.cvFile}
              target="_blank"
              rel="noopener noreferrer"
              className="about-link-chip badge-solid badge-gray"
            >
              → Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
