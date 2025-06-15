import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
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

  return (
    <HelmetProvider>
      <Helmet
        title={props.title}
        meta={[
          { name: 'description', content: main.description },
          { name: 'keywords', content: main.keywords },
        ]}
      >
        <html lang="en" />
      </Helmet>
      <div id="wrapper">
        <div id="main">{props.children}</div>
        {props.fullPage ? null : (
          <div id="sidebar">
            <div className="inner">
              <section id="intro">
                <Link to="/" className="logo">
                  <img src={author.photo} alt="" />
                </Link>
                <header>
                  <h2>{author.name}</h2>
                  <p>
                    <a href={`mailto:${author.email}`}>{author.email}</a>
                  </p>
                </header>
              </section>
              {(!isMobile || !isAboutPage) && (
                <section className="blurb">
                  <h2>About</h2>
                  <p>{author.minibio}</p>
                  <ul className="actions">
                    <li>
                      {!props.fullPage ? (
                        <Link to="/about" className="button">
                          Learn More
                        </Link>
                      ) : (
                        <Link to="/" className="button">
                          Back to Home
                        </Link>
                      )}
                    </li>
                  </ul>
                </section>
              )}
              <section id="footer">
                <ul className="icons">
                  {author.social.map((soc) => (
                    <li key={soc.label}>
                      <a
                        href={soc.url}
                        className={`icon ${soc.icon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="label">{soc.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="copyright">
                  &copy; {author.name} <Link to="/">{main.url}</Link>.
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

SideBar.propTypes = {
  children: PropTypes.node,
  fullPage: PropTypes.bool,
  title: PropTypes.string,
};

export default SideBar;
