import React from 'react';
import { Link } from 'react-router-dom';

import Hamburger from './Hamburger';
import routes from '../../data/routes';
import { useTheme } from '../../contexts/ThemeContext';

// Websites Navbar, displays routes defined in 'src/data/routes'
const Navigation = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header id="header">
      <h1 className="index-link">
        <Link
          to="/"
          onClick={(e) => e.preventDefault()}
          style={{ pointerEvents: 'none', cursor: 'default' }}
        >
          Daniel Zlotnick
        </Link>
      </h1>
      <nav className="links">
        <ul>
          {routes
            .filter((l) => !l.index)
            .map((l) => (
              <li key={l.label}>
                <Link to={l.path}>{l.label}</Link>
              </li>
            ))}
        </ul>
      </nav>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        type="button"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <Hamburger />
    </header>
  );
};

export default Navigation;
