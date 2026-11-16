import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';
import mainMedia from '../components/Projects/ProjectIMG/ProjectNexus.png';

const About = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/PN.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });
  }, []); // Added dependency array to avoid infinite loop

  return (
    <Main
      title="NexusRTS"
      description="NexusRTS is a real-time trucking tool that predicts traffic slowdowns, optimizes routes, and estimates costs. A project by Daniel Zlotnick."
    >
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <Link to="/projects/ProjectNexus">NexusRTS</Link>
            </h2>
          </div>
        </header>
        <div className="about-content">
          <img src={mainMedia} alt="" className="about-image" style={{ maxWidth: '100%', height: 'auto' }} />
          <div className="markdown-content">
            <Markdown>{markdown}</Markdown>
          </div>
        </div>
      </article>
    </Main>
  );
};

export default About;
