import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
