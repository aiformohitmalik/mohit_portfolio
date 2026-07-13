import React from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { iconnectData } from '../../data/iconnect';
import './IConnectPage.css';

export const IConnectPage = ({ onNavigate }) => {
  const data = iconnectData;

  return (
    <PageLayout title="Built to Last" onBack={() => onNavigate('/')}>
      {/* Hero Section */}
      <section className="subpage-hero iconnect-hero">
        <div className="diagonal-lines-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label">02 — LEADERSHIP LEGACY</span>
          <h1 className="subpage-hero-title">{data.title}</h1>
          <div className="subpage-hero-subtitle">
            <span>{data.subtitle}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span>{data.role}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span className="badge-solid badge-purple">{data.institution}</span>
          </div>
          
          <blockquote className="iconnect-hero-quote">
            "{data.heroQuote}"
          </blockquote>
        </div>
      </section>

      {/* Stats Bar Section */}
      <section className="subpage-section container">
        <SectionHeading num="01" title="Legacy In Numbers" />
        <div className="iconnect-stats-grid">
          {data.stats.map((stat, i) => (
            <div key={i} className="iconnect-stat-card">
              <span className="iconnect-stat-val">{stat.value}</span>
              <p className="iconnect-stat-lbl">{stat.label}</p>
              <span className="iconnect-stat-sub">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative & Timeline Section */}
      <section className="subpage-section container">
        <div className="subpage-grid-2">
          {/* Left: General Overview */}
          <div>
            <SectionHeading num="02" title="The iConnect Building Story" />
            <p className="about-paragraph" style={{ fontSize: '15px', marginBottom: '24px' }}>
              {data.overview}
            </p>
            <div className="badge-solid badge-purple" style={{ padding: '24px', borderRadius: '10px' }}>
              <h3 style={{ fontSize: '15px', color: 'var(--purple-primary)', marginBottom: '8px' }}>Transition Reflection</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {data.reflection}
              </p>
            </div>
          </div>

          {/* Right: Visual Timeline */}
          <div className="timeline-wrapper" style={{ marginTop: 0 }}>
            <div className="timeline-line" />
            
            {data.timeline.map((node, i) => (
              <div key={i} className="timeline-node" style={{ marginBottom: '32px' }}>
                <div className="timeline-dot timeline-dot-active" style={{ borderColor: 'var(--purple-primary)', background: 'var(--purple-primary)' }} />
                
                <div className="timeline-content-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{node.title}</h4>
                    <span className="timeline-date" style={{ fontFamily: 'var(--font-mono)' }}>{node.date}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default IConnectPage;
