import React, { useEffect } from 'react';
import './PageLayout.css';

export const PageLayout = ({ children, title }) => {
  // Update browser tab title on enter, restore on leave
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${title} | Mohit Malik`;
    return () => { document.title = originalTitle; };
  }, [title]);

  return (
    <div className="pagelayout-wrapper page-transition-enter">
      <main className="pagelayout-content">
        {children}
      </main>

      <footer className="pagelayout-footer">
        <div className="container pagelayout-footer-container">
          <span className="caption-text" style={{ color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} Mohit Malik · Physical AI Engineer
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
