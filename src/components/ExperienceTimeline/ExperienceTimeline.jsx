import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Accordion } from '../Accordion/Accordion';
import { internshipsData } from '../../data/internships';
import './ExperienceTimeline.css';

export const ExperienceTimeline = ({ experience, onNavigate }) => {
  const [timelineRef, isRevealed] = useScrollReveal({ threshold: 0.05, triggerOnce: true });

  return (
    <div className="timeline-wrapper" ref={timelineRef}>
      <div className="timeline-line" />
      <div
        className="timeline-line-active"
        style={{ height: isRevealed ? '100%' : '0%' }}
      />

      {/* 1. EDAG INDIA PVT. LTD. */}
      {(() => {
        const edag = experience.find(e => e.id === 'edag');
        if (!edag) return null;
        return (
          <div className="timeline-node" key={edag.id}>
            <div className={`timeline-dot ${isRevealed ? 'timeline-dot-active' : ''}`} />

            <div className="timeline-content-card">
              <div className="timeline-header">
                <div className="timeline-meta">
                  <span className="timeline-company">{edag.company}</span>
                  <span className="timeline-role">{edag.role}</span>
                </div>
                <span className="timeline-date">{edag.duration}</span>
              </div>

              <div className="timeline-body">
                {edag.phases && edag.phases[0] && (
                  <div className="growth-phase-block" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <div className="growth-phase-header">
                      <span className="growth-phase-title" style={{ color: 'var(--amber-primary)' }}>
                        {edag.phases[0].title}
                      </span>
                      <span className="badge-solid badge-amber">Current Scope</span>
                    </div>
                    <span className="timeline-date">{edag.phases[0].duration}</span>
                    <ul className="timeline-bullets">
                      {edag.phases[0].bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                    <div className="timeline-chips">
                      {edag.phases[0].skills.map(s => (
                        <span key={s} className="badge-solid badge-gray">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="growth-arc-container">
                  <div className="growth-arc-indicator">
                    <TrendingUp size={12} />
                    <span>Promotion & Scope Expansion to Digital Twin</span>
                  </div>
                </div>

                {edag.phases && edag.phases[1] && (
                  <div className="growth-phase-block">
                    <div className="growth-phase-header">
                      <span className="growth-phase-title">{edag.phases[1].title}</span>
                      <span className="timeline-date">{edag.phases[1].duration}</span>
                    </div>
                    <ul className="timeline-bullets">
                      {edag.phases[1].bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                    <div className="timeline-chips">
                      {edag.phases[1].skills.map(s => (
                        <span key={s} className="badge-solid badge-gray">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <span
                  onClick={() => onNavigate(edag.deepDiveUrl)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate(edag.deepDiveUrl); } }}
                  className="redirect-cta-btn"
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                >
                  <span>EDAG Deep-Dive</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. Ground Rebotics Pvt. Ltd. */}
      {(() => {
        const startup = experience.find(e => e.id === 'ground-rebotics');
        if (!startup) return null;
        return (
          <div className="timeline-node" key={startup.id} style={{ marginBottom: '48px' }}>
            <div className={`timeline-dot ${isRevealed ? 'timeline-dot-active' : ''}`} />

            <div className="timeline-content-card" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div className="timeline-header">
                <div className="timeline-meta">
                  <span className="timeline-company" style={{ color: 'var(--text-secondary)' }}>
                    {startup.company}
                  </span>
                  <span className="timeline-role" style={{ fontSize: '13px' }}>{startup.role}</span>
                </div>
                <span className="timeline-date">{startup.duration}</span>
              </div>

              <p className="caption-text" style={{ fontStyle: 'italic', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                {startup.summary}
              </p>

              <div className="timeline-body">
                <div className="timeline-chips" style={{ marginBottom: '16px' }}>
                  <span className="badge-solid badge-amber">{startup.fundingBadge}</span>
                  <span className="badge-solid badge-blue">{startup.incubationBadge}</span>
                </div>
                <ul className="timeline-bullets">
                  {startup.bullets.map((b, i) => (
                    <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{b}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <span
                  onClick={() => onNavigate(startup.deepDiveUrl)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate(startup.deepDiveUrl); } }}
                  className="redirect-cta-btn"
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                >
                  <span>The Founder Years</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. Collapsible Internships & Training */}
      <div className="timeline-node" style={{ paddingLeft: 0 }}>
        <div className={`timeline-dot ${isRevealed ? 'timeline-dot-active' : ''}`} />

        <Accordion title="+ 5 Internships & Training (2022–2023)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {internshipsData.map((intern, idx) => (
              <div
                key={idx}
                style={{
                  borderBottom: idx < internshipsData.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  paddingBottom: idx < internshipsData.length - 1 ? '16px' : '0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{intern.title}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{intern.company} ({intern.location})</span>
                  </div>
                  <span className="timeline-date">{intern.duration}</span>
                </div>
                <ul className="timeline-bullets" style={{ marginTop: '8px', paddingLeft: '12px' }}>
                  {intern.bullets.map((b, i) => (
                    <li key={i} style={{ fontSize: '12px', marginBottom: '4px' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <span
                onClick={() => onNavigate('/internships')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('/internships'); } }}
                className="redirect-cta-btn"
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <span>View Full Details & Learning Path</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default ExperienceTimeline;
