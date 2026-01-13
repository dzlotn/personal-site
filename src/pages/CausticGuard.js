import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';

const { PUBLIC_URL } = process.env;

const CausticGuard = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/CausticGuard.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });
  }, []);

  return (
    <Main title="CausticGuard" description="Learn about CausticGuard">
      <article className="post markdown" id="causticguard">
        <header>
          <div className="title">
            <h2>
              <Link to="/projects/CausticGuard">CausticGuard</Link>
            </h2>
          </div>
        </header>
        <div className="about-content">
          <img src={`${PUBLIC_URL}/images/projects/optiblack.png`} alt="" className="about-image" style={{ maxWidth: '100%', height: 'auto' }} />
          <div className="markdown-content">
            <Markdown>{markdown}</Markdown>
          </div>
        </div>
      </article>
    </Main>
  );
};

export default CausticGuard;
