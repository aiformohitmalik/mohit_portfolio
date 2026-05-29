import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { navLinks } from '../../data/navigation';
import { personalData } from '../../data/personal';
import './Navbar.css';

export const Navbar = ({ currentRoute, onNavigate }) => {
  const { scrollY, scrollPercent } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = scrollY > 50;

  // Toggle Mobile Menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close Mobile Menu on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle section scrolling
  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    
    if (currentRoute !== '/') {
      // Navigate to Home, then scroll to section
      onNavigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Calculate percentage bar width (always 0 on sub pages per spec)
  const progressWidth = currentRoute === '/' ? scrollPercent : 0;

  return (
    <>
      {/* Top scroll progress line */}
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${progressWidth}%` }} 
      />

      <nav className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Logo & Navigation Path */}
          <div className="logo-group">
            <div className="logo" onClick={() => { onNavigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
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

          {/* Desktop Nav Links */}
          <div className="nav-links-desktop">
            {navLinks.map((link) => (
              <span
                key={link.path}
                className="nav-item"
                onClick={() => handleNavClick(link.path)}
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

          {/* Mobile Hamburger Trigger */}
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

      {/* Fullscreen Mobile Overlay Menu */}
      <div className={`mobile-overlay ${mobileMenuOpen ? 'mobile-overlay-active' : ''}`}>
        <div className="mobile-nav-list">
          {navLinks.map((link, idx) => (
            <span
              key={link.path}
              className="mobile-nav-item"
              onClick={() => handleNavClick(link.path)}
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
