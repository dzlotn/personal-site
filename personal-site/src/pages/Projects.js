// Projects.js
import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';
import Cell from '../components/Projects/Cell';
import data from '../data/projects';

const Projects = () => (
  <Main title="Projects" description="Learn about Daniel Zlotnick's projects.">
    <article className="post" id="projects">
      <header>
        <div className="title">
          <h2>
            <Link to="/projects">Projects</Link>
          </h2>
          <p>Click on each project to learn more</p>
        </div>
      </header>
      {data.map((project) => (
        <Cell data={project} key={project.slug} />
      ))}
    </article>
  </Main>
);

export default Projects;
