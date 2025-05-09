module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testEnvironment: 'jest-environment-jsdom', 
  transform: {
    '^.+\\.jsx?$': 'babel-jest', 
  },
  moduleNameMapper: {
    '^.+\\.css$': 'identity-obj-proxy',
  },
};