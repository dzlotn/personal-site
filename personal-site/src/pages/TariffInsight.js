import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';

const { PUBLIC_URL } = process.env;

const TariffInsight = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/TariffInsight.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });
  }, []);

  return (
    <Main title="TariffInsight" description="Learn about TariffInsight">
      <article className="post markdown" id="tariffinsight">
        <header>
          <div className="title">
            <h2>
              <Link to="/projects/TariffInsight">TariffInsight</Link>
            </h2>
          </div>
        </header>
        <div className="about-content">
          <img src={`${PUBLIC_URL}/images/projects/tariffpic2.png`} alt="" className="about-image" style={{ maxWidth: '100%', height: 'auto' }} />
          <div className="markdown-content">
            <Markdown>{markdown}</Markdown>
          </div>
        </div>
      </article>
    </Main>
  );
};

export default TariffInsight;
