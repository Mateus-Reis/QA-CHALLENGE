import { defineConfig } from 'cypress';
import { mkdir, writeFile } from 'node:fs/promises';

const accessibilitySpecPattern = 'cypress/e2e/**/*-accessibility.cy.ts';

export default defineConfig({
  e2e: {
    baseUrl: 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      const suite = config.env.suite ?? 'main';

      if (suite !== 'main' && suite !== 'accessibility') {
        throw new Error(
          `Unknown suite "${suite}". Use "main" or "accessibility".`,
        );
      }

      on('after:run', async (results) => {
        if (!results) return;

        const report =
          'runs' in results
            ? {
                suite,
                startedAt: results.startedTestsAt,
                endedAt: results.endedTestsAt,
                durationMs: results.totalDuration,
                browser: results.browserName,
                browserVersion: results.browserVersion,
                cypressVersion: results.cypressVersion,
                nodeVersion: process.version,
                osName: results.osName,
                osVersion: results.osVersion,
                totalTests: results.totalTests,
                totalPassed: results.totalPassed,
                totalFailed: results.totalFailed,
                totalPending: results.totalPending,
                totalSkipped: results.totalSkipped,
                specs: results.runs.map(({ spec, stats, tests, error }) => ({
                  spec: spec.relative,
                  stats,
                  tests,
                  error,
                })),
              }
            : results;

        await mkdir('reports', { recursive: true });
        await writeFile(
          `reports/${suite}-results.json`,
          `${JSON.stringify(report, null, 2)}\n`,
        );
      });

      if (config.isInteractive) return config;

      return suite === 'accessibility'
        ? {
            ...config,
            specPattern: accessibilitySpecPattern,
            screenshotsFolder: 'cypress/screenshots/accessibility',
            retries: { runMode: 0, openMode: 0 },
          }
        : {
            ...config,
            excludeSpecPattern: accessibilitySpecPattern,
            screenshotsFolder: 'cypress/screenshots/main',
          };
    },
  },
  blockHosts: [
    '*.doubleclick.net',
    '*.googlesyndication.com',
    '*.googletagservices.com',
    '*.adtrafficquality.google',
  ],
  defaultCommandTimeout: 8000,
  pageLoadTimeout: 60000,
  retries: { runMode: 1, openMode: 0 },
  viewportWidth: 1280,
  viewportHeight: 720,
});
