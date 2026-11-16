import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';
import MathBlock from '../components/Math/MathBlock';

const { PUBLIC_URL } = process.env;
const markdownOptions = { overrides: { pre: { component: MathBlock } } };

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
    <Main
      title="CausticGuard"
      description="CausticGuard is a CUDA-accelerated, motion-adaptive caustics suppression system for underwater computer vision. A project by Daniel Zlotnick."
    >
      <article className="post markdown" id="causticguard">
        <header>
          <div className="title">
            <h2>
              <Link to="/projects/CausticGuard">CausticGuard</Link>
            </h2>
          </div>
        </header>
        <div className="about-content">
          <img src={`${PUBLIC_URL}/images/projects/caustic.png`} alt="" className="about-image" style={{ maxWidth: '100%', height: 'auto' }} />
          <div className="markdown-content">
            <Markdown options={markdownOptions}>{markdown}</Markdown>
          </div>
        </div>
      </article>
    </Main>
  );
};

export default CausticGuard;
