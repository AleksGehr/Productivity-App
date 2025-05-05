import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock import.meta.env
global.importMeta = {
  env: {
    VITE_FIREBASE_API_KEY: 'mock-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'mock-auth-domain',
    VITE_FIREBASE_PROJECT_ID: 'mock-project-id',
  },
};

console.log('setupTests.js loaded');