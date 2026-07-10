import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { navLinks } from '../../data/navigation';
import { personalData } from '../../data/personal';
import './Navbar.css';

export const Navbar = ({ currentRoute, onNavigate }) => {
  const { scrollY, scrollPercent } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = scrollY > 50;
  const pendingSectionRef = useRef(null);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to pending section after home page renders (replaces fragile setTimeout)
  useEffect(() => {
    if (pendingSectionRef.current && currentRoute === '/') {
      const sectionId = pendingSectionRef.current;
      pendingSectionRef.current = null;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = document.getElementById(sectionId);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
  }, [currentRoute]);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (currentRoute !== '/') {
      onNavigate('/');
      pendingSectionRef.current = sectionId;
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const progressWidth = currentRoute === '/' ? scrollPercent : 0;

  const logoKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navKeyDown = (sectionId) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavClick(sectionId);
    }
  };

  return (
    <>
      <div className="scroll-progress-bar" style={{ width: `${progressWidth}%` }} />

      <nav className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-container">
          <div className="logo-group">
            <div
              className="logo"
              role="button"
              tabIndex={0}
              onClick={() => { onNavigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onKeyDown={logoKeyDown}
            >
              MOHIT
            </div>
            {currentRoute !== '/' && (
              <>
                <div className="nav-divider" />
                <button
                  className="nav-back-btn"
                  onClick={() => onNavigate('/')}
                  aria-label="Back to Home"
                >
                  <ArrowLeft size={14} />
                  <span>BACK TO HOME</span>
                </button>
              </>
            )}
          </div>

          <div className="nav-links-desktop">
            {navLinks.map((link) => (
              <span
                key={link.path}
                className="nav-item"
                role="button"
                tabIndex={0}
                onClick={() => handleNavClick(link.path)}
                onKeyDown={navKeyDown(link.path)}
              >
                {link.label}
              </span>
            ))}
            <a
              href={personalData.cvFile}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary cta-outlined"
              style={{ height: '36px', padding: '0 16px', fontSize: '13px' }}
            >
              Download CV →
            </a>
          </div>

          <button
            className={`hamburger-btn ${mobileMenuOpen ? 'hamburger-active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line line-top"></span>
            <span className="hamburger-line line-middle"></span>
            <span className="hamburger-line line-bottom"></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-overlay ${mobileMenuOpen ? 'mobile-overlay-active' : ''}`}>
        <div className="mobile-nav-list">
          {navLinks.map((link, idx) => (
            <span
              key={link.path}
              className="mobile-nav-item"
              role="button"
              tabIndex={0}
              onClick={() => handleNavClick(link.path)}
              onKeyDown={navKeyDown(link.path)}
              style={{ cursor: 'pointer' }}
            >
              <span className="mobile-nav-num">0{idx + 1}</span>
              {link.label}
            </span>
          ))}
          <a
            href={personalData.cvFile}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ marginTop: '24px' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Download CV →
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
