const config = {
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
    '^.+\\.md$': 'markdown-to-jsx',
    '^@vercel/analytics/react$': '<rootDir>/__mocks__/@vercel/analytics.js',
    '^react-ga4$': '<rootDir>/__mocks__/react-ga4.js',
  },
};

module.exports = config;
