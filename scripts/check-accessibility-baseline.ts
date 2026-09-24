import { readFile } from 'node:fs/promises';

interface AccessibilityReport {
  specs: { tests: { title: string[]; state: string }[] }[];
}

const reportPath = 'reports/accessibility-results.json';

const knownFailures: Record<string, string> = {
  'Text Box accessibility > associates visible labels with the form fields':
    'TB-01',
  'Text Box accessibility > has no WCAG 2.1 A or AA axe violations in the initial form':
    'TB-01',
  'Text Box accessibility > has no WCAG 2.1 A or AA axe violations after submission':
    'TB-01',
  'Select Menu accessibility > has no WCAG 2.1 A or AA axe violations with a grouped combobox open':
    'SM-01, SM-02',
  'Select Menu accessibility > has no WCAG 2.1 A or AA axe violations after selecting values':
    'SM-01',
};

const report: AccessibilityReport = JSON.parse(
  await readFile(reportPath, 'utf8'),
);
const tests = report.specs.flatMap(({ tests }) =>
  tests.map(({ title, state }) => ({ title: title.join(' > '), state })),
);
const failed = tests
  .filter(({ state }) => state === 'failed')
  .map(({ title }) => title);

const unexpected = failed.filter((title) => !(title in knownFailures));
const noLongerFailing = Object.keys(knownFailures).filter(
  (title) => !failed.includes(title),
);

for (const title of unexpected) {
  console.error(`Unexpected failure: ${title}`);
}
for (const title of noLongerFailing) {
  console.error(`No longer failing (${knownFailures[title]}): ${title}`);
}

if (tests.length === 0 || unexpected.length || noLongerFailing.length) {
  process.exitCode = 1;
} else {
  console.log(
    `Accessibility audit matches the baseline: ${failed.length} known failures in ${tests.length} tests.`,
  );
}
