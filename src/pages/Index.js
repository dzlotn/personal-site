import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Main from '../layouts/Main';
import EmailLink from '../components/Contact/EmailLink';

const Index = () => (
  <Main>
    <Helmet title="About this site" />
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/">About this site</Link></h2>
          <p className="subtitle">A sleek, responsive, statically-generated react application written with modern Javascript.</p>
        </div>
      </header>
      <p> Welcome to my website. Please feel free to read more <Link to="/about">about me</Link>,
        or you can check out my {' '}
        <Link to="/projects">projects</Link>, {' '}
        or <Link to="/contact">contact</Link> me.
      </p>
      <p> Source available <a href="https://github.com/dzlotn/personal-site">here</a>.</p>
    </article>
  </Main>
);

export default Index;
