import React from 'react';
import PropTypes from 'prop-types';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// A ```math fenced code block renders as <pre><code className="lang-math">source</code></pre>.
// Overriding `pre` lets us intercept before the default <pre><code> box styling applies,
// and pull the raw (unparsed) LaTeX straight out of the nested <code> element.
const PreOrMath = ({ children }) => {
  const child = Array.isArray(children) ? children[0] : children;
  const isMath = child && child.props && child.props.className === 'lang-math';

  if (isMath) {
    const source = Array.isArray(child.props.children)
      ? child.props.children.join('')
      : child.props.children;
    return (
      <div className="math-block">
        <BlockMath math={String(source).trim()} />
      </div>
    );
  }

  return <pre>{children}</pre>;
};

PreOrMath.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PreOrMath;
