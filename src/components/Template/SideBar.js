import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
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
        Hi, I&apos;m Daniel Zlotnick, a Computer Science student
        at Cornell University with a passion for solving complex problems
        and leveraging technology to make a real-world impact.
        I&apos;m currently pursuing a major in Computer Science and
        a minor in Business.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? (
            <Link to="/resume" className="button">
              Learn More
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
        &copy; Daniel Zlotnick <Link to="/">mldangelo.com</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;
