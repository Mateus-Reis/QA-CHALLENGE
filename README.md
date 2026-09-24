# QA Automation Challenge

End-to-end tests for [DemoQA](https://demoqa.com/) using Cypress and TypeScript. The suite covers forms, selections, and dialogs, with responsive checks on the main flows and a separate accessibility audit.

## Coverage

| Page          | Main scenarios                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Text Box      | Submission, email validation and recovery, empty fields, replacing submitted values, Unicode and multiline input, and HTML-like text |
| Practice Form | Submission of personal details, hobbies, and address; required-field validation; invalid mobile numbers (data-driven)                |
| Select Menu   | Replacing grouped selections, removing and restoring multiselect options, and changing native selections                             |
| Modal Dialogs | Small and large dialog content, dismissal controls, Escape, and reopening                                                            |
| Selectable    | Selecting two list items and removing one while retaining the other                                                                  |
| Book Store    | Filtering by title, checking the matching author, and clearing the search                                                            |

Text Box, Select Menu, and Modal Dialogs also have responsive specs at 1280 x 720 and 390 x 844, plus keyboard and scoped axe checks in the accessibility audit.

## Prerequisites

- Node.js 24.x and npm. The version is also defined in [.nvmrc](.nvmrc).
- Google Chrome.
- Internet access to install dependencies and reach DemoQA.

On Linux, install the system dependencies listed in the [Cypress installation guide](https://docs.cypress.io/app/get-started/install-cypress#System-requirements).

## Setup

```bash
git clone https://github.com/Mateus-Reis/QA-CHALLENGE.git
cd QA-CHALLENGE
npm ci
```

`npm ci` installs the locked dependencies and downloads the Cypress binary. No local server, account, or credentials are required.

## Run tests

Run the main suite (functional and responsive specs) in headless Chrome:

```bash
npm test
```

| Command                      | Purpose                                                                    |
| ---------------------------- | -------------------------------------------------------------------------- |
| `npm test`                   | Main suite, headless. Expected to pass                                     |
| `npm run test:headed`        | Main suite with a visible Chrome window                                    |
| `npm run test:a11y`          | Accessibility audit, headless. Expected to fail on the known defects below |
| `npm run test:a11y:baseline` | Compare the last audit with the known defects                              |
| `npm run test:open`          | Interactive Cypress runner with every spec, including accessibility        |
| `npm run typecheck`          | TypeScript check                                                           |
| `npm run format:check`       | Prettier check (`npm run format` applies it)                               |

Run a single spec or folder by passing `--spec` to the matching suite:

```bash
npm test -- --spec "cypress/e2e/text-box/text-box.cy.ts"
npm run test:a11y -- --spec "cypress/e2e/text-box/text-box-accessibility.cy.ts"
```

## Configuration

[cypress.config.ts](cypress.config.ts) holds the shared settings:

| Setting           | Value                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------- |
| Base URL          | `https://demoqa.com`                                                                    |
| Command timeout   | 8 seconds (`defaultCommandTimeout`)                                                     |
| Page load timeout | 60 seconds (`pageLoadTimeout`)                                                          |
| Retries           | 1 for the main suite in `cypress run`; 0 for the audit and in `cypress open`            |
| Blocked hosts     | Google ad and ad-verification hosts ([why](SUMMARY.md#flakiness-and-how-it-is-handled)) |
| Default viewport  | 1280 x 720; the responsive specs also use 390 x 844                                     |
| Suite selection   | `--env suite=accessibility` runs only `*-accessibility.cy.ts`                           |

The suite uses no fixed-duration waits. Options can be overridden with `--config`, as described in the [Cypress configuration docs](https://docs.cypress.io/app/references/configuration#Overriding-Options), except the spec pattern, screenshot folder, and audit retries, which the suite selection sets.

## Project structure

| Location                        | Responsibility                                                       |
| ------------------------------- | -------------------------------------------------------------------- |
| `cypress/e2e/<page>/`           | Functional, responsive, and accessibility specs, grouped by page     |
| `cypress/pages/`                | Page objects with centralized selectors and reusable interactions    |
| `cypress/data/`                 | Typed test data shared by the specs                                  |
| `cypress/support/commands.ts`   | Custom commands: `cy.fillField` and `cy.checkAccessibility`          |
| `cypress/support/assertions/`   | Shared checks for submitted values, layout, focus, and accessibility |
| `docs/evidence/`                | Run output, defect evidence, and investigation captures              |
| `scripts/`                      | Baseline check that compares audit failures with the known defects   |
| `.github/workflows/cypress.yml` | CI: install, checks, both suites, and artifact upload                |

Specs describe expected behavior; page objects own selectors and interactions. Every test starts from a fresh visit.

## Results

Recorded locally on September 24, 2026 in Chrome 153 on macOS:

| Suite               | Tests | Passed | Failed | Pending |
| ------------------- | ----: | -----: | -----: | ------: |
| Main (`npm test`)   |    26 |     26 |      0 |       0 |
| Accessibility audit |    17 |     10 |      5 |       2 |

The main suite passed in two consecutive runs without retries. The five accessibility failures are real defects (TB-01, SM-01, SM-02); the two pending tests are quarantined while MD-01 is investigated. Details are in [DEFECTS.md](DEFECTS.md), and the terminal output of the last runs is in [main-suite-run.txt](docs/evidence/main-suite-run.txt) and [accessibility-suite-run.txt](docs/evidence/accessibility-suite-run.txt).

[SUMMARY.md](SUMMARY.md) covers the approach, flakiness handling, and trade-offs. [IMPROVEMENTS.md](IMPROVEMENTS.md) has recommendations for CI, suite organization, test data, and metrics.

## Reports

| Output                               | Created by                                                    |
| ------------------------------------ | ------------------------------------------------------------- |
| Terminal                             | Every run: per-spec results and the final summary table       |
| `reports/main-results.json`          | `npm test` and `npm run test:headed`: totals, tests, attempts |
| `reports/accessibility-results.json` | `npm run test:a11y`: totals, tests, attempts                  |
| `reports/accessibility/*.json`       | Each axe scan, written before its assertion                   |
| `cypress/screenshots/<suite>/`       | Failed attempts during `cypress run`                          |

Generated reports and screenshots are ignored by Git and overwritten by later runs.

## Continuous integration

The [GitHub Actions workflow](.github/workflows/cypress.yml) runs on pushes to `main`, pull requests, and manual dispatch. It installs dependencies, checks TypeScript and formatting, and runs the main suite, which decides the job status. The accessibility audit runs next as a non-blocking step, and a baseline check then fails the job only if its failures differ from the known defects: a new failure, a known defect that stops failing, or a missing report. Reports, logs, and screenshots from both suites are uploaded as the `cypress-evidence` artifact and kept for 14 days.
