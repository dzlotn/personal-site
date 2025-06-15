import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Main from '../layouts/Main';
import EmailLink from '../components/Contact/EmailLink';
import { index } from '../data/main';

const Index = () => (
  <Main>
    <Helmet title={index.title} />
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/">{index.title}</Link></h2>
          <p className="subtitle">{index.subtitle}</p>
        </div>
      </header>
      <p> Welcome to my website. Please feel free to read more <Link to="/about">about me</Link>,
        or you can check out my {' '}
        <Link to="/resume">resume</Link>, {' '}
        <Link to="/projects">projects</Link>, {' '}
        view <Link to="/stats">site statistics</Link>, {' '}
        or <Link to="/contact">contact</Link> me.
      </p>
      <p> Source available <a href={index.source}> here</a>.</p>
    </article>
  </Main>
);

export default Index;
