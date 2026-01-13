import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Cell = ({ data }) => {
  const { isDarkMode } = useTheme();

  // Try to get dark mode image, fallback to regular image
  const getImageSrc = () => {
    if (isDarkMode && data.imageDark) {
      return `${process.env.PUBLIC_URL}${data.imageDark}`;
    }
    return `${process.env.PUBLIC_URL}${data.image}`;
  };

  return (
    <div className="cell-container">
      <article className="mini-post">
        <header>
          <h3>
            {/* Use Link instead of a tag for client-side routing */}
            <Link to={`/projects/${data.slug}`}>{data.title}</Link>
          </h3>
          <time className="published">
            {dayjs(data.date).format('MMMM, YYYY')}
          </time>
        </header>
        {/* Use Link for the image as well */}
        <Link to={`/projects/${data.slug}`} className="image">
          <img src={getImageSrc()} alt={data.title} />
        </Link>
        <div className="description">
          <p>{data.desc}</p>
          {data.techs && data.techs.length > 0 && (
            <div className="tech-tags">
              {data.techs.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired, // Add slug to the shape
    image: PropTypes.string.isRequired,
    imageDark: PropTypes.string,
    date: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    techs: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Cell;
