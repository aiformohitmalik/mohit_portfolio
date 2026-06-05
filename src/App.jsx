import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { HomePage } from './pages/HomePage/HomePage';
import { GroundReboticsPage } from './pages/GroundReboticsPage/GroundReboticsPage';
import { IConnectPage } from './pages/IConnectPage/IConnectPage';
import { CampusPage } from './pages/CampusPage/CampusPage';
import { InternshipsPage } from './pages/InternshipsPage/InternshipsPage';
import { EdagPage } from './pages/EdagPage/EdagPage';

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
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <>
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />
      <div className="main-content-wrapper">
        {renderCurrentPage()}
      </div>
    </>
  );
};

export default App;
