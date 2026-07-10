import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { HomePage } from './pages/HomePage/HomePage';
import { GroundReboticsPage } from './pages/GroundReboticsPage/GroundReboticsPage';
import { IConnectPage } from './pages/IConnectPage/IConnectPage';
import { CampusPage } from './pages/CampusPage/CampusPage';
import { InternshipsPage } from './pages/InternshipsPage/InternshipsPage';
import { EdagPage } from './pages/EdagPage/EdagPage';
import { ChatWidget } from './components/ChatWidget/ChatWidget';
import { MouseTrail } from './components/MouseTrail/MouseTrail';
import { StormAudio } from './components/StormAudio/StormAudio';

// Import CSS Design System
import './styles/tokens.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/layout.css';
import './styles/animations.css';
import './styles/utilities.css';

export const App = () => {
  const [currentRoute, setCurrentRoute] = useState('/');

  // High performance, robust client-side path router
  useEffect(() => {
    const parseRouteFromLocation = () => {
      const hash = window.location.hash;

      // Support legacy shared hash links by canonicalizing them to clean URLs.
      if (hash && hash.startsWith('#/')) {
        const legacyRoute = hash.substring(1);
        window.history.replaceState({}, '', legacyRoute);
        setCurrentRoute(legacyRoute);
        return;
      }

      const pathname = window.location.pathname;
      const route = pathname === '' ? '/' : pathname;
      setCurrentRoute(route);
    };

    window.addEventListener('popstate', parseRouteFromLocation);
    parseRouteFromLocation(); // Initial route parse

    return () => {
      window.removeEventListener('popstate', parseRouteFromLocation);
    };
  }, []);

  // Pre-warm Render backend on page load (fire-and-forget)
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/health`).catch(() => {}); // Silent pre-warm
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const scrollingElement = document.scrollingElement;
    const originalRootBehavior = root.style.scrollBehavior;
    const originalBodyBehavior = body.style.scrollBehavior;

    root.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';

    window.scrollTo(0, 0);
    if (scrollingElement) {
      scrollingElement.scrollTop = 0;
    }
    root.scrollTop = 0;
    body.scrollTop = 0;

    const layoutWrappers = document.querySelectorAll(
      '.pagelayout-wrapper, .page-transition-enter, .main-content-wrapper, main, #root > div'
    );

    layoutWrappers.forEach((wrapper) => {
      wrapper.scrollTop = 0;
    });

    const frameId = requestAnimationFrame(() => {
      root.style.scrollBehavior = originalRootBehavior;
      body.style.scrollBehavior = originalBodyBehavior;
    });

    return () => {
      cancelAnimationFrame(frameId);
      root.style.scrollBehavior = originalRootBehavior;
      body.style.scrollBehavior = originalBodyBehavior;
    };
  }, [currentRoute]);

  const navigateTo = (route) => {
    // Remove leading hash if present
    const cleanRoute = route.startsWith('#') ? route.substring(1) : route;
    // Standardize routing: must start with '/' e.g. '/ground-rebotics'
    const formatted = cleanRoute.startsWith('/') ? cleanRoute : `/${cleanRoute}`;
    window.history.pushState({}, '', formatted);
    setCurrentRoute(formatted);
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case '/':
        return <HomePage onNavigate={navigateTo} />;
      case '/ground-rebotics':
        return <GroundReboticsPage onNavigate={navigateTo} />;
      case '/iconnect':
        return <IConnectPage onNavigate={navigateTo} />;
      case '/campus':
        return <CampusPage onNavigate={navigateTo} />;
      case '/internships':
        return <InternshipsPage onNavigate={navigateTo} />;
      case '/edag':
        return <EdagPage onNavigate={navigateTo} />;
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', textAlign: 'center', padding: '40px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'var(--amber-primary)' }}>404</h1>
            <h2 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>Page not found</h2>
            <button className="btn btn-primary" onClick={() => navigateTo('/')}>Back to Home</button>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />
      <div className="main-content-wrapper">
        {renderCurrentPage()}
      </div>
      <ChatWidget />
      <MouseTrail />
      <StormAudio />
    </>
  );
};

export default App;
