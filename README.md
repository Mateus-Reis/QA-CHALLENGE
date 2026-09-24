# QA Automation Challenge

End-to-end tests for [DemoQA](https://demoqa.com/) using Cypress and TypeScript. The suite covers forms, selections, and dialogs, with responsive and accessibility checks on the main flows.

## Coverage

| Page          | Main scenarios                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Text Box      | Submission, email validation and recovery, empty fields, replacing submitted values, Unicode and multiline input, and HTML-like text |
| Select Menu   | Replacing grouped selections, removing and restoring multiselect options, and changing native selections                             |
| Modal Dialogs | Small and large dialog content, dismissal controls, Escape, and reopening                                                            |
| Practice Form | Submission and confirmation of name, email, gender, and mobile number                                                                |
| Selectable    | Selecting two list items and removing one while retaining the other                                                                  |
| Book Store    | Filtering by title, checking the matching author, and clearing the search                                                            |

Text Box, Select Menu, and Modal Dialogs also have keyboard and scoped axe checks at the default desktop viewport. Their responsive specs exercise the flows at 1280 x 720 and 390 x 844. The other three pages have focused functional coverage.

## Prerequisites

- Git, Node.js 24.x, and npm. The Node version is also defined in [.nvmrc](.nvmrc).
- Google Chrome installed locally.
- Internet access to install dependencies and reach DemoQA.

On Linux, install the system dependencies listed in the [Cypress installation guide](https://docs.cypress.io/app/get-started/install-cypress#System-requirements).

## Setup

```bash
git clone https://github.com/Mateus-Reis/QA-CHALLENGE.git
cd QA-CHALLENGE
npm ci
```

If you use nvm, run `nvm use` before installing dependencies. `npm ci` installs the versions recorded in the lockfile and downloads the Cypress binary. The tests use the public website; no local application server, account, or credentials are required.

## Run tests

Run the full suite in headless Chrome:

```bash
npm test
```

The recorded full runs contain seven failing accessibility tests. Those assertions remain enabled, so the full command and CI job fail while the reported behavior persists. See [Results and known failures](#results-and-known-failures) before interpreting the exit status.

| Command                | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `npm run test:headed`  | Run the full suite with a visible Chrome window               |
| `npm run test:open`    | Open the interactive Cypress runner; choose Chrome and a spec |
| `npm run typecheck`    | Check TypeScript without emitting files                       |
| `npm run format:check` | Check formatting with Prettier                                |
| `npm run format`       | Apply Prettier formatting                                     |

Run one spec:

```bash
npm test -- --spec "cypress/e2e/text-box.cy.ts"
```

Run only the accessibility specs during an investigation:

```bash
npm test -- --spec "cypress/e2e/*-accessibility.cy.ts"
```

Spec filtering limits the coverage executed; use `npm test` for the complete results. Additional options follow the [Cypress CLI](https://docs.cypress.io/app/references/command-line).

## Configuration

[cypress.config.ts](cypress.config.ts) defines the shared settings:

| Setting                        | Value                                  |
| ------------------------------ | -------------------------------------- |
| Base URL                       | `https://demoqa.com`                   |
| Spec pattern                   | `cypress/e2e/**/*.cy.ts`               |
| Support file                   | `cypress/support/e2e.ts`               |
| Default viewport               | 1280 x 720                             |
| Additional responsive viewport | 390 x 844, set by the responsive specs |

Timeouts use the Cypress defaults. Queries and assertions retry until their timeout; whole-test retries are not enabled, and the suite uses no fixed-duration waits. No `.env` or `cypress.env.json` file is required. Configuration can be overridden through the [Cypress configuration options](https://docs.cypress.io/app/references/configuration#Overriding-Options), including `--config` on the command line.

## Project structure

| Location                        | Responsibility                                                              |
| ------------------------------- | --------------------------------------------------------------------------- |
| `cypress/e2e/`                  | Functional, responsive, and accessibility specs with outcome assertions     |
| `cypress/pages/`                | Page objects with centralized selectors and reusable interactions           |
| `cypress/data/`                 | Typed test data shared by the specs                                         |
| `cypress/support/assertions/`   | Shared checks for submitted values, layout, focus, and accessibility        |
| `cypress/support/e2e.ts`        | Loads native keyboard event support                                         |
| `docs/evidence/`                | Retained reports and investigation captures referenced by the documentation |
| `.github/workflows/cypress.yml` | CI installation, checks, test execution, and artifact upload                |

Specs express expected behavior; page objects handle how to interact with each page. Tests start from a fresh visit instead of depending on previous tests. Small assertion helpers keep repeated checks consistent. Typed data modules serve the current inputs without a separate fixture layer.

## Results and known failures

The recorded local runs on September 23, 2026 and the [CI run on September 24, 2026](https://github.com/Mateus-Reis/QA-CHALLENGE/actions/runs/35977214462) produced the same totals:

| Coverage      |  Tests | Passed | Failed |
| ------------- | -----: | -----: | -----: |
| Functional    |     17 |     17 |      0 |
| Responsive    |      6 |      6 |      0 |
| Accessibility |     17 |     10 |      7 |
| **Total**     | **40** | **33** |  **7** |

No tests were pending or skipped. TypeScript and formatting checks passed. The seven failures are:

- Three Text Box checks for label associations and accessible names.
- Two Select Menu scans for accessible names and text contrast.
- Two Modal Dialogs checks where forward Tab navigation leaves the dialog in Cypress. The influence of the application versus the runner remains unresolved.

These are observed results, not a guarantee for future runs against the public site. [SUMMARY.md](SUMMARY.md) records the approach, results, and limits. [DEFECTS.md](DEFECTS.md) contains reproduction steps, expected and actual behavior, severity, priority, and evidence. It also documents the standalone focus comparison and intermittent focus behavior involving an advertising iframe.

## View reports and evidence

The terminal prints per-spec results and the final totals. Expand a failed command in the interactive runner to inspect its assertion and page state.

| Output                         | When it is created                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `reports/results.json`         | After a `cypress run`, including both `npm test` and `npm run test:headed`; contains totals and per-spec results |
| `reports/accessibility/*.json` | When each axe scan completes, before its assertion; includes violations and checks needing manual review         |
| `cypress/screenshots/`         | Automatically on test failures during `cypress run`                                                              |
| `reports/cypress-run.log`      | Captured by the GitHub Actions workflow                                                                          |
| `docs/evidence/`               | Curated snapshots retained in the repository; not regenerated by the test commands                               |

`npm run test:open` shows results in the runner and writes axe reports when those scans execute. It does not generate `reports/results.json` with the current configuration. Videos are not enabled.

Generated reports and screenshots are ignored by Git. Report filenames are reused, and a partial run can leave accessibility JSON files from a previous run. Preserve any evidence you need before rerunning, and check each report's timestamp and scope. The full-run JSON describes only the specs executed in that run.

## Continuous integration

The [GitHub Actions workflow](.github/workflows/cypress.yml) runs on pull requests, pushes to `main`, and manual dispatch. It installs dependencies with `npm ci`, checks TypeScript and formatting, and runs the full suite in Chrome on Linux.

To view a run, open the repository's [Actions page](https://github.com/Mateus-Reis/QA-CHALLENGE/actions), select the workflow run, and open the `test` job. Download `cypress-evidence` from the run's Artifacts section for the available reports, logs, and failure screenshots. Artifacts are retained for 14 days and uploaded even when tests fail. The test exit status is preserved, so the known failing assertions leave the job red.

## Limitations and further work

Viewport checks do not replace real-device testing, and scoped axe scans do not establish full accessibility conformance. Screen readers, other browsers, authentication, and exhaustive field combinations are outside the executed coverage. The public site and its advertising content can change independently of this repository.

[IMPROVEMENTS.md](IMPROVEMENTS.md) describes further work on CI feedback, suite organization, test data, tagging, parallelization, reliability, and useful metrics.

## References

Page objects follow the structure requested by the challenge. These references cover the pattern, APIs, accessibility expectations, and tooling relevant to this suite.

### Test design and Cypress

- [Page Object, Martin Fowler](https://martinfowler.com/bliki/PageObject.html): encapsulating page interactions and separating them from test assertions.
- [Cypress selectors](https://docs.cypress.io/app/core-concepts/best-practices#Selecting-Elements): choosing selectors and deciding when visible text belongs in an assertion.
- [Cypress retry-ability](https://docs.cypress.io/app/core-concepts/retry-ability) and [clear](https://docs.cypress.io/api/commands/clear): retrying queries and assertions, and querying elements again between actions.
- [Cypress test isolation](https://docs.cypress.io/app/core-concepts/test-isolation): keeping tests independent of earlier browser state.
- [Cypress TypeScript support](https://docs.cypress.io/app/tooling/typescript-support): TypeScript configuration and Cypress command types.
- [Cypress after:run event](https://docs.cypress.io/api/node-events/after-run-api): accessing run results to write the JSON summary.

### Accessibility and keyboard interaction

- [axe-core API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axerun): scoped scans, WCAG tag selection, violations, and incomplete checks.
- [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): initial focus, Tab and Shift+Tab containment, Escape, and returning focus to the opener.
- [cypress-real-events: realPress](https://github.com/dmtrKovalenko/cypress-real-events#cyrealpress): native keyboard events and key combinations.

### Formatting and CI

- [Prettier configuration](https://prettier.io/docs/configuration): shared formatting settings.
- [GitHub Actions artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data): uploading, retaining, and downloading reports and screenshots.
