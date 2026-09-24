import { defineConfig } from 'cypress';
import { mkdir, writeFile } from 'node:fs/promises';

export default defineConfig({
  e2e: {
    baseUrl: 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on) {
      on('after:run', async (results) => {
        if (!results) return;

        const report =
          'runs' in results
            ? {
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
          'reports/results.json',
          `${JSON.stringify(report, null, 2)}\n`,
        );
      });
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
