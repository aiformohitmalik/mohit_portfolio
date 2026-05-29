import React from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import { groundReboticsData } from '../../data/groundRebotics';
import './GroundReboticsPage.css';

export const GroundReboticsPage = ({ onNavigate }) => {
  const data = groundReboticsData;

  return (
    <PageLayout title="The Founder Years" onBack={() => onNavigate('/')}>
      {/* Hero Section */}
      <section className="subpage-hero">
        <div className="diagonal-lines-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label">01 — FOUNDER EXPERIENCE</span>
          <h1 className="subpage-hero-title">{data.title}</h1>
          <div className="subpage-hero-subtitle">
            <span>{data.company}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span>{data.duration}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span className="badge-solid badge-amber">{data.location}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span className="badge-solid badge-blue">{data.fundingTotal}</span>
          </div>
          <p className="subpage-headline">{data.metaHeadline}</p>
        </div>
      </section>

      {/* Narrative Context Section */}
      <section className="subpage-section container">
        <div className="subpage-grid-2">
          <div>
            <SectionHeading num="01" title="Venture Context" />
            <p className="about-paragraph" style={{ fontSize: '15px' }}>
              {data.contextParagraph}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
            <div className="badge-solid badge-amber" style={{ padding: '24px', borderRadius: '10px' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--amber-primary)', marginBottom: '8px' }}>Incubation & Government Backing</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Incubated inside the **Atal Incubation Centre (AIC) at IIT Delhi**, the venture was evaluated and vetted under strict regulatory processes to secure public capital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Achievements Section */}
      <section className="subpage-section container">
        <SectionHeading num="02" title="Operational Milestones" />
        <div className="op-grid">
          {data.operationalAchievements.map((op, i) => (
            <div key={i} className="op-card">
              <h4 className="op-card-title">{op.title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{op.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* National Stages Recognitions Section */}
      <section className="subpage-section container">
        <SectionHeading num="03" title="National Stages & Pitches" />
        <p className="caption-text" style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Represented the company and pitched key industrial IP to venture analysts and institutional panels across the country.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="rec-table">
            <tbody>
              {data.awards.map((award, i) => (
                <tr key={i} className="rec-row">
                  <td className="rec-cell rec-cell-prize">{award.prize}</td>
                  <td className="rec-cell rec-cell-event">{award.event}</td>
                  <td className="rec-cell rec-cell-venue">{award.venue}</td>
                  <td className="rec-cell rec-cell-date">{award.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Projects Brief Section */}
      <section className="subpage-section container">
        <SectionHeading num="04" title="Incubated Hardware Deployments" />
        <div className="subpage-grid-2">
          {data.projects.map((proj, i) => (
            <div key={i} className="op-card" style={{ borderLeft: '3px solid var(--blue-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{proj.name}</h4>
                <span className="caption-text" style={{ fontFamily: 'var(--font-mono)' }}>{proj.year}</span>
              </div>
              <span className="badge-solid badge-blue" style={{ display: 'inline-block', marginBottom: '12px' }}>
                {proj.funding}
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{proj.context}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Additive Manufacturing Analysis Section */}
      <section className="subpage-section container">
        <div className="subpage-grid-2">
          <div>
            <SectionHeading num="05" title="Additive Manufacturing Study" />
            <p className="about-paragraph" style={{ fontSize: '14px', lineHeight: 1.7 }}>
              {data.additiveMfg.desc}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <div className="badge-solid badge-gray" style={{ padding: '16px' }}>
              <span className="mono-text" style={{ color: 'var(--amber-primary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                MATERIALS EVALUATED
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                PLA, Tough PLA, TPU 95A, ABS, SLA Resins, SLS Powders (50+ total)
              </span>
            </div>
            <div className="badge-solid badge-gray" style={{ padding: '16px' }}>
              <span className="mono-text" style={{ color: 'var(--blue-primary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                EQUIPMENT STANDARD
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Ultimaker S5 High-Precision Fused Deposition Modeling (FDM)
              </span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default GroundReboticsPage;
