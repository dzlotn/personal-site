import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';

const { PUBLIC_URL } = process.env;

const Index = () => {
  const [markdown, setMarkdown] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 736);

  useEffect(() => {
    import('../data/about.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 736);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Main
      title="About"
      description="Learn about Daniel Zlotnick"
    >
      {isMobile && (
        <section id="intro" style={{ marginBottom: '2em' }}>
          <div className="logo">
            <img src={`${PUBLIC_URL}/images/file.jpg`} alt="" />
          </div>
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
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <Link to="/">About Me</Link>
            </h2>
          </div>
        </header>
        <Markdown>{markdown}</Markdown>
      </article>
    </Main>
  );
};

export default Index;
