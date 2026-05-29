import React from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { campusData } from '../../data/campus';
import * as Icons from 'lucide-react';
import './CampusPage.css';

export const CampusPage = ({ onNavigate }) => {
  const data = campusData;

  const getIconColor = (iconName) => {
    if (iconName === 'Award') return 'var(--amber-primary)';
    if (iconName === 'Shield') return 'var(--blue-primary)';
    if (iconName === 'Activity') return 'var(--green-primary)';
    return 'var(--purple-primary)';
  };

  const getBadgeClass = (iconName) => {
    if (iconName === 'Award') return 'badge-amber';
    if (iconName === 'Shield') return 'badge-blue';
    if (iconName === 'Activity') return 'badge-green';
    return 'badge-purple';
  };

  return (
    <PageLayout title="Beyond the Degree" onBack={() => onNavigate('/')}>
      {/* Hero Section */}
      <section className="subpage-hero" style={{ background: 'radial-gradient(circle at 10% 20%, #071C11 0%, #0A0A0A 60%)' }}>
        <div className="diagonal-lines-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label">03 — BEYOND THE CLASSROOM</span>
          <h1 className="subpage-hero-title">{data.title}</h1>
          <div className="subpage-hero-subtitle">
            <span>{data.subtitle}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span className="badge-solid badge-green">Discipline & Leadership</span>
          </div>
          <p className="subpage-headline">{data.intro}</p>
        </div>
      </section>

      {/* Grid of Campus Achievements */}
      <section className="subpage-section container">
        <div className="campus-card-grid">
          {data.categories.map((cat) => {
            const IconComponent = Icons[cat.icon] || Icons.HelpCircle;
            const iconColor = getIconColor(cat.icon);
            const badgeClass = getBadgeClass(cat.icon);

            return (
              <div key={cat.id} className="campus-achievement-card">
                <div className="campus-achievement-header">
                  <div className="campus-achievement-icon" style={{ color: iconColor }}>
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="campus-achievement-title">{cat.title}</h3>
                    {cat.tagline && <span className="campus-achievement-sub">{cat.tagline}</span>}
                  </div>
                </div>

                <div className="subpage-body">
                  <ul className="subpage-bullet-list">
                    {cat.highlights.map((bullet, idx) => (
                      <li key={idx} style={{ fontSize: '13px' }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageLayout>
  );
};

export default CampusPage;
