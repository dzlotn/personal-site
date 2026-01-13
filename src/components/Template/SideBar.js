import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 736);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 736);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="sidebar">
      {(!isMobile || isHomePage) && (
        <section id="intro">
          <Link to="/" className="logo">
            <img src={`${PUBLIC_URL}/images/file.jpg`} alt="" />
          </Link>
          <header>
            <h2>Daniel Zlotnick</h2>
            <p>
              <a href="mailto:daniel.zlotnick5@gmail.com">
                daniel.zlotnick5@gmail.com
              </a>
            </p>
          </header>
        </section>
      )}

      {(!isMobile || isHomePage) && (
        <section className="blurb">
          <h2>About</h2>
          <p>
            Hi, I&apos;m Daniel Zlotnick, a student at{' '}
            <a href="https://www.cornell.edu/">Cornell University</a> with a
            passion for solving complex problems and harnessing technology to
            create meaningful change. I&apos;m currently studying at{' '}
            <a href="https://www.engineering.cornell.edu/">
              Cornell Engineering
            </a>
            , pursuing both a Bachelor of Science and a{' '}
            <a href="https://www.cs.cornell.edu/master-engineering-computer-science">
              Master of Engineering
            </a>{' '}
            in <a href="https://www.cs.cornell.edu/">Computer Science</a>.
          </p>

          <ul className="actions">
            <li>
              {window.location.pathname.includes('/about') ? (
                <Link to="/projects" className="button">
                  My Projects
                </Link>
              ) : (
                <Link to="/about" className="button">
                  About Me
                </Link>
              )}
            </li>
          </ul>
        </section>
      )}

      <section id="footer">
        <ContactIcons />
        <p className="copyright">&copy; Daniel Zlotnick</p>
      </section>
    </section>
  );
};

export default SideBar;
