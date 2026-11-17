import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';
import MathBlock from '../components/Math/MathBlock';

const markdownOptions = { overrides: { pre: { component: MathBlock } } };

const LOOT = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/LOOT.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });
  }, []);

  return (
    <Main
      title="LOOT"
      description="LOOT is a Leave-One-Out Transformer that lets masked diffusion language models revise their own tokens, published at NeurIPS 2026. Research by Daniel Zlotnick and collaborators at the Cornell Relax ML Lab."
    >
      <article className="post markdown" id="loot">
        <header>
          <div className="title">
            <h2>
              <Link to="/projects/LOOT">LOOT</Link>
            </h2>
          </div>
        </header>
        <div className="about-content">
          <div className="markdown-content">
            <Markdown options={markdownOptions}>{markdown}</Markdown>
          </div>
        </div>
      </article>
    </Main>
  );
};

export default LOOT;
