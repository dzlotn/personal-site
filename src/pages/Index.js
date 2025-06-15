import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 736);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 736);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const AboutContent = () => (
    <div className="mobile-about" style={{ marginBottom: '2em' }}>
      <section id="intro" style={{ textAlign: 'center', marginBottom: '2em' }}>
        <Link to="/" className="logo">
          <img
            src={`${process.env.PUBLIC_URL}/images/file.jpg`}
            alt="Daniel Zlotnick"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1em'
            }}
          />
        </Link>
        <header>
          <h2 style={{ marginBottom: '0.5em' }}>Daniel Zlotnick</h2>
          <p>
            <a href="mailto:daniel.zlotnick5@gmail.com">daniel.zlotnick5@gmail.com</a>
          </p>
        </header>
      </section>

      <section className="blurb" style={{ textAlign: 'left' }}>
        <h2>About</h2>
        <p>
          Hi, I&apos;m Daniel Zlotnick, a student
          at <a href="https://www.cornell.edu/">Cornell University</a> with a passion for solving complex problems
          and harnessing technology to create meaningful change.
          I&apos;m currently pursuing a major in <a href="https://www.cs.cornell.edu/">Computer Science</a> and
          a minor in <a href="https://business.cornell.edu/programs/undergraduate/minors/business-engineers/">Business</a>.
        </p>
      </section>
    </div>
  );

  return (
    <Main
      description={
        "Daniel Zlotnick's personal website. Cornell University student, "
        + 'Computer Science major with a Business minor.'
      }
    >
      <article className="post" id="index">
        {isMobile && <AboutContent />}
        <header>
          <div className="title">
            <h2>
              <Link to="/">About this site</Link>
            </h2>
            <p>
              A sleek, responsive, statically-generated react application
              written with modern Javascript.
            </p>
          </div>
        </header>
        <p>
          {' '}
          Welcome to my website. Please feel free to read more{' '}
          <Link to="/about">about me</Link> or you can check out my{' '}
          <Link to="/projects">projects</Link>.
        </p>
        {/* <p>
          {' '}
          Source available{' '}
          <a href="https://github.com/mldangelo/personal-site">here</a>.
        </p> */}
      </article>
    </Main>
  );
};

export default Index;
