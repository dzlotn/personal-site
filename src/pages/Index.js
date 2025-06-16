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

  return (
    <Main
      description={
        "Daniel Zlotnick's personal website. Cornell University student, "
        + 'Computer Science major with a Business minor.'
      }
    >
      {!isMobile && (
        <article className="post" id="index">
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
        </article>
      )}
    </Main>
  );
};

export default Index;
