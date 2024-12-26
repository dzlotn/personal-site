import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';
import mediaOne from '../components/Projects/ProjectIMG/devicetable.png';
import mediaTwo from '../components/Projects/ProjectIMG/psdgraph.png';

const About = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/TT.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });
  }, []); // Added dependency array to avoid infinite loop

  return (
    <Main title="About" description="Learn about Daniel Zlotnick">
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <Link to="/TremorTrackr">TremorTrackr</Link>
            </h2>
          </div>
        </header>
        <div className="about-content">
          <img src={mediaOne} alt="m1" className="about-image" style={{ maxWidth: '100%', height: 'auto', width: '300px' }} />
          <img src={mediaTwo} alt="m2" className="about-image" style={{ maxWidth: '100%', height: 'auto', width: '500px' }} />

          <div className="markdown-content">
            <Markdown>{markdown}</Markdown>
          </div>
        </div>
      </article>
    </Main>
  );
};

export default About;
