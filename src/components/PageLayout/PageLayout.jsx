import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import './PageLayout.css';

export const PageLayout = ({ children, title, onBack }) => {
  // Always scroll to top when page enters, and update browser tab title
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const originalTitle = document.title;
    document.title = `${title} | Mohit Malik`;
    return () => {
      document.title = originalTitle;
    };
  }, [title]);

  return (
    <div className="pagelayout-wrapper page-transition-enter">
      {/* Main sub page content */}
      <main className="pagelayout-content">
        {children}
      </main>

      {/* Standardized professional footer */}
      <footer className="pagelayout-footer">
        <div className="container pagelayout-footer-container">
          <span className="caption-text" style={{ color: 'var(--text-tertiary)' }}>
            © 2025 Mohit Malik · Physical AI Engineer
          </span>
          <span className="mono-text" style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
            ROHTAK, INDIA
          </span>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
