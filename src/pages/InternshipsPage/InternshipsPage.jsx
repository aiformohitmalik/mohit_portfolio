import React, { useState } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { internshipsData, certificationsData } from '../../data/internships';
import './InternshipsPage.css';

export const InternshipsPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const { nptel, industry, linkedin } = certificationsData;

  const tabs = ['ALL', 'NPTEL SWAYAM', 'INDUSTRY CERTS', 'LINKEDIN LEARNING'];

  return (
    <PageLayout title="Training Ground" onBack={() => onNavigate('/')}>
      {/* Hero Section */}
      <section className="subpage-hero" style={{ background: 'radial-gradient(circle at 10% 20%, #0A1929 0%, #0A0A0A 60%)' }}>
        <div className="diagonal-lines-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label">04 — CREDENTIALS & TRAININGS</span>
          <h1 className="subpage-hero-title">Training Ground</h1>
          <div className="subpage-hero-subtitle">
            <span>MSME Certifications</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span>NPTEL All India Rank 5</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span className="badge-solid badge-blue">Continuing Education</span>
          </div>
          <p className="subpage-headline">
            Systematic physical AI and mechanical training programs completed across state-certified institutions, IITs, and global learning channels.
          </p>
        </div>
      </section>

      {/* Section 1: Detailed Placements & Internships */}
      <section className="subpage-section container">
        <SectionHeading num="01" title="Internships & Applied Training" />
        <div className="intern-grid">
          {internshipsData.map((intern, i) => (
            <div key={i} className="intern-card" style={{ borderLeft: i === 1 ? '3px solid var(--amber-primary)' : '1px solid var(--border-default)' }}>
              <div className="timeline-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '8px' }}>
                <div className="timeline-meta">
                  <span className="timeline-company" style={{ color: 'var(--text-primary)' }}>{intern.title}</span>
                  <span className="timeline-role" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {intern.company} ({intern.location})
                  </span>
                </div>
                <span className="timeline-date">{intern.duration}</span>
              </div>
              <ul className="subpage-bullet-list" style={{ marginTop: '12px' }}>
                {intern.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Certifications and filter tabs */}
      <section className="subpage-section container">
        <SectionHeading num="02" title="Academic & Industry Certifications" />
        
        {/* Interactive filter tabs */}
        <div className="cert-filter-row">
          {tabs.map((t) => (
            <button
              key={t}
              className={`cert-filter-btn ${activeTab === t ? 'cert-filter-btn-active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 2A. NPTEL SWAYAM Display */}
        {(activeTab === 'ALL' || activeTab === 'NPTEL SWAYAM') && (
          <div className="badge-solid badge-blue" style={{ padding: '24px', borderRadius: '10px', width: '100%', marginBottom: '32px', display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--blue-primary)' }}>{nptel.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{nptel.issuer}</span>
              </div>
              <span className="badge-solid badge-amber" style={{ fontSize: '12px', padding: '6px 12px' }}>
                {nptel.air}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{nptel.summary}</p>
            <div className="cert-grid">
              {nptel.courses.map((course, idx) => (
                <div key={idx} className="badge-solid badge-gray" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{course.name}</span>
                  <span className="mono-text" style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{course.institute}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2B. Industry Certifications Grid */}
        {(activeTab === 'ALL' || activeTab === 'INDUSTRY CERTS') && (
          <div style={{ marginBottom: activeTab === 'ALL' ? '32px' : '0' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
              Industry Core Credentials
            </h3>
            <div className="cert-grid">
              {industry.map((cert, idx) => (
                <div key={idx} className="cert-card">
                  <div className="cert-card-header">
                    <span className="cert-card-title">{cert.name}</span>
                    <span className="cert-card-date">{cert.date}</span>
                  </div>
                  <span className="cert-card-issuer" style={{ marginTop: 'auto' }}>{cert.issuer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2C. LinkedIn Learning path */}
        {(activeTab === 'ALL' || activeTab === 'LINKEDIN LEARNING') && (
          <div>
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
              LinkedIn Continuous Professional Learning
            </h3>
            <div className="cert-grid">
              {linkedin.map((course, idx) => (
                <div key={idx} className="cert-card" style={{ borderLeft: '3px solid var(--purple-primary)' }}>
                  <div className="cert-card-header" style={{ marginBottom: 0 }}>
                    <span className="cert-card-title">{course}</span>
                  </div>
                  <span className="cert-card-issuer" style={{ marginTop: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    LinkedIn Certified Course
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default InternshipsPage;
