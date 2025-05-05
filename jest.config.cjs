module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Verknüpft die setupTests.js
  testEnvironment: 'jest-environment-jsdom', // Stellt sicher, dass die Tests in einer Browser-ähnlichen Umgebung laufen
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Verwende Babel für die Transformation von JS/JSX-Dateien
  },
  moduleNameMapper: {
    '^.+\\.css$': 'identity-obj-proxy', // Mocke CSS-Dateien
  },
};