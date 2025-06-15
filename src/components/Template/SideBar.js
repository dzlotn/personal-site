import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Analytics from '../Analytics';
import Navigation from './Navigation';
import Main from '../layouts/Main';
import { author } from '../../data/authors/default';
import { main } from '../../data/main';
import PropTypes from 'prop-types';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 736);
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 736);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const AboutContent = () => (
    <>
      <section id="intro">
        <Link to="/" className="logo">
          <img src={`${PUBLIC_URL}/images/file.jpg`} alt="" />
        </Link>
        <header>
          <h2>Daniel Zlotnick</h2>
          <p>
            <a href="mailto:daniel.zlotnick5@gmail.com">daniel.zlotnick5@gmail.com</a>
          </p>
        </header>
      </section>

      <section className="blurb">
        <h2>About</h2>
        <p>
          Hi, I&apos;m Daniel Zlotnick, a student
          at <a href="https://www.cornell.edu/">Cornell University</a> with a passion for solving complex problems
          and harnessing technology to create meaningful change.
          I&apos;m currently pursuing a major in <a href="https://www.cs.cornell.edu/">Computer Science</a> and
          a minor in <a href="https://business.cornell.edu/programs/undergraduate/minors/business-engineers/">Business</a>.
        </p>
        {/* <img src={`${PUBLIC_URL}/images/file.jpg`} alt="" /> */}

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

      <section id="footer">
        <ContactIcons />
        <p className="copyright">
          &copy; Daniel Zlotnick
        </p>
      </section>
    </>
  );

  if (isMobile) {
    return null; // Don't render sidebar on mobile
  }

  return (
    <section id="sidebar">
      <AboutContent />
    </section>
  );
};

export default SideBar;
