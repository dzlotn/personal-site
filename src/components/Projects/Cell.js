import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const MAX_VISIBLE_TECHS = 10;

const Cell = ({ data }) => {
  const techs = data.techs || [];
  const visibleTechs = techs.slice(0, MAX_VISIBLE_TECHS);

  return (
    <Link to={`/projects/${data.slug}`} className="project-card">
      <div className="project-card-image">
        <img
          src={`${process.env.PUBLIC_URL}${data.image}`}
          alt={data.title}
          style={data.imageFit ? { objectFit: data.imageFit } : undefined}
        />
      </div>
      <div className="project-card-body">
        <header>
          <h3>{data.title}</h3>
          <time className="published">
            {dayjs(data.date).format('MMMM, YYYY')}
          </time>
        </header>
        <p className="description">{data.desc}</p>
        {visibleTechs.length > 0 && (
          <div className="tech-tags">
            {visibleTechs.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageFit: PropTypes.string,
    date: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    techs: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Cell;
