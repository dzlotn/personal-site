const config = {
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
    '^.+\\.md$': 'markdown-to-jsx',
    '^@vercel/analytics/react$': '<rootDir>/__mocks__/@vercel/analytics.js',
  },
};

module.exports = config;
