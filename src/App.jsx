import React, { useState, useEffect } from 'react';
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

  // High performance, robust client-side Hash Router
  useEffect(() => {
    const parseRouteFromHash = () => {
      const hash = window.location.hash;
      // Strip hash symbol, treating empty or '#/' as home
      if (!hash || hash === '#/') {
        setCurrentRoute('/');
      } else {
        const parsed = hash.substring(1); // e.g. "/ground-rebotics"
        setCurrentRoute(parsed);
      }
    };

    window.addEventListener('hashchange', parseRouteFromHash);
    parseRouteFromHash(); // Initial route parse

    return () => {
      window.removeEventListener('hashchange', parseRouteFromHash);
    };
  }, []);

  const navigateTo = (route) => {
    // Remove leading hash if present
    const cleanRoute = route.startsWith('#') ? route.substring(1) : route;
    // Standardize routing: must start with '/' e.g. '/ground-rebotics'
    const formatted = cleanRoute.startsWith('/') ? cleanRoute : `/${cleanRoute}`;
    window.location.hash = `#${formatted}`;
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
