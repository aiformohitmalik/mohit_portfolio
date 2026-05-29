import React from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading';
import './EdagPage.css';

export const EdagPage = ({ onNavigate }) => {
  return (
    <PageLayout title="From BIW to Omniverse" onBack={() => onNavigate('/')}>
      {/* Hero Section */}
      <section className="subpage-hero" style={{ background: 'radial-gradient(circle at 10% 20%, #1F1407 0%, #0A0A0A 60%)' }}>
        <div className="diagonal-lines-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label">05 — INDUSTRIAL DEEP-DIVE</span>
          <h1 className="subpage-hero-title">From BIW to Omniverse</h1>
          <div className="subpage-hero-subtitle">
            <span>EDAG PS INDIA</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span>Robotic Simulation & Digital Twin</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span className="badge-solid badge-amber">Current Role</span>
          </div>
          <p className="subpage-headline">
            Inside BMW-standard automotive plant design, transitioning into USD-based virtual layouts and NVIDIA Omniverse Kit automation workflows.
          </p>
        </div>
      </section>

      {/* Grid: Narrative vs Stack */}
      <section className="subpage-section container">
        <div className="edag-grid">
          {/* Left Column: Tech Stack & Tools */}
          <div className="edag-stack-box">
            <h3 style={{ fontSize: '16px', color: 'var(--amber-primary)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              Tooling Stack & Protocols
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Corporate standard simulation frameworks and APIs utilized for plant validation.
            </p>

            <div className="edag-tool-row">
              <div className="edag-tool-item">
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Siemens Process Simulate</span>
                <span className="badge-solid badge-amber">BIW Daily Driver</span>
              </div>
              <div className="edag-tool-item">
                <span style={{ fontSize: '14px', fontWeight: 500 }}>NVIDIA Omniverse Kit</span>
                <span className="badge-solid badge-amber">Python API & Extensions</span>
              </div>
              <div className="edag-tool-item">
                <span style={{ fontSize: '14px', fontWeight: 500 }}>OpenUSD (Universal Scene Description)</span>
                <span className="badge-solid badge-blue">Virtual Assembly Standard</span>
              </div>
              <div className="edag-tool-item">
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Gaussian Splatting</span>
                <span className="badge-solid badge-green">3D Reconstruction</span>
              </div>
              <div className="edag-tool-item">
                <span style={{ fontSize: '14px', fontWeight: 500 }}>BMW Group Standards</span>
                <span className="badge-solid badge-gray">Precision Protocol</span>
              </div>
            </div>
          </div>

          {/* Right Column: In-depth Detail Phases */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Phase 2 */}
            <div>
              <SectionHeading num="01" title="Digital Twin & Omniverse (01/2026 - Present)" />
              <p className="about-paragraph" style={{ fontSize: '14px', lineHeight: 1.65, marginBottom: '12px' }}>
                Moved into advanced virtualization divisions to bridge robotic kinematics with real-time immersive layout telemetry.
              </p>
              <ul className="subpage-bullet-list">
                <li>
                  <strong>Omniverse Kit Extensions</strong>: Programmed clean Python modules inside Omniverse to support dynamic CAD imports and kinematics rendering.
                </li>
                <li>
                  <strong>USD Core Layouts</strong>: Designed modular Universal Scene Description layouts to configure virtual factories with full material physics.
                </li>
                <li>
                  <strong>3D Splatting Reconstruction</strong>: Deployed pipelines converting point clouds and camera captures into lightweight, precise spatial digital twins.
                </li>
              </ul>
            </div>

            {/* Phase 1 */}
            <div>
              <SectionHeading num="02" title="BIW Plant Automation (06/2024 - 01/2026)" />
              <p className="about-paragraph" style={{ fontSize: '14px', lineHeight: 1.65, marginBottom: '12px' }}>
                Anchored in precision manufacturing, ensuring robotic lines are fully collision-validated according to strict German standards.
              </p>
              <ul className="subpage-bullet-list">
                <li>
                  <strong>BMW Assembly Standards</strong>: Engineered Body-in-White (BIW) fixtures, frames, and robot cell limits strictly aligned to BMW drafting and tolerance rules.
                </li>
                <li>
                  <strong>Kinematics & Cycle Optimization</strong>: Simulated robot operations (welding, grabbing, placing) to reduce cycle times and optimize robotic reach.
                </li>
                <li>
                  <strong>Offline Programming (OLP)</strong>: Exported and validated robot coordinate code, eliminating physical commissioning collisions by 100%.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EdagPage;
