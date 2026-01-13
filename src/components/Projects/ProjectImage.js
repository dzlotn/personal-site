import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const { PUBLIC_URL } = process.env;

const ProjectImage = ({
  src,
  darkSrc,
  alt,
  className,
  style,
}) => {
  const { isDarkMode } = useTheme();

  const imageSrc = isDarkMode && darkSrc ? darkSrc : src;
  const fullSrc = imageSrc.startsWith('http')
    ? imageSrc
    : `${PUBLIC_URL}${imageSrc}`;

  return (
    <img
      src={fullSrc}
      alt={alt || ''}
      className={className}
      style={style}
    />
  );
};

ProjectImage.propTypes = {
  src: PropTypes.string.isRequired,
  darkSrc: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.shape({
    // Allow any CSS properties
  }),
};

ProjectImage.defaultProps = {
  darkSrc: undefined,
  alt: '',
  className: undefined,
  style: undefined,
};

export default ProjectImage;
