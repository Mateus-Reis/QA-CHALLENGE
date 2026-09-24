# Test summary

**Verified:** 2026-09-23 locally in Chrome on macOS; 2026-09-24 in GitHub Actions using Chrome on Linux.

## Approach

The suite covers one page from each homepage category: Text Box (Elements), Practice Form (Forms), Modal Dialogs (Alerts, Frame & Windows), Select Menu (Widgets), Selectable (Interactions), and the Book Store catalogue. TypeScript page objects centralize selectors and interactions; typed modules hold input data; specs assert outcomes. Functional coverage includes validation and recovery, submission accuracy, selection removal, dialog dismissal, and catalogue filtering.

Responsive and accessibility checks target Text Box, Select Menu, and Modal Dialogs. Native keyboard events exercise navigation; retrying assertions replace fixed waits. Layout checks use 1280 × 720 and 390 × 844 viewports with actual interactions and obstruction checks. Scoped axe scans use WCAG 2.1 A/AA tags and preserve violations and incomplete checks as JSON before assertions fail.

## Results

| Coverage      |  Tests | Passed | Failed |
| ------------- | -----: | -----: | -----: |
| Functional    |     17 |     17 |      0 |
| Responsive    |      6 |      6 |      0 |
| Accessibility |     17 |     10 |      7 |
| **Total**     | **40** | **33** |  **7** |

Two local full `npm test` runs produced identical test outcomes in 49.704s and 49.930s, both exiting with code 7. Neither run had pending or skipped tests. The recorded source hashes describe the working tree used for those local runs. TypeScript and Prettier checks passed. [Recorded local results and source hashes](docs/evidence/final-runs.json).

The [GitHub Actions run for PR #12](https://github.com/Mateus-Reis/QA-CHALLENGE/actions/runs/35977214462) reproduced the same 33 passing and seven failing tests on Linux, with no pending or skipped tests. Dependency installation, TypeScript, formatting, and evidence upload passed. Cypress exited with code 7, leaving the job failed. The [cypress-evidence artifact](https://github.com/Mateus-Reis/QA-CHALLENGE/actions/runs/35977214462/artifacts/10799055829) contains reports, logs, and failure screenshots and is retained for 14 days.

Five failures concern Text Box labels and Select Menu names/contrast. Two concern forward focus containment in the Cypress modal tests, which differed from standalone Chrome. A focused diagnostic also observed intermittent reverse navigation into an advertising iframe. No retries or exclusions conceal these outcomes. Two runs do not establish long-term stability. [Defects and investigation evidence](DEFECTS.md).

## Trade-offs and limits

Practice Form covers required fields and email through confirmation; summary dismissal and other optional fields are untested. Book Store covers public catalogue search, not authentication. React Select requires structural locators; its keyboard checks passed locally on macOS and in Linux CI. Focus shadows and axe scans do not establish full accessibility conformance; incomplete checks need manual review. Modal layout checks cover currently fitting content. Real devices, screen readers, other browsers, and exhaustive inputs remain outside this coverage.

`npm test` generates `reports/results.json`, `reports/accessibility/*.json`, and failure screenshots in `cypress/screenshots/`. Later runs reuse report filenames; partial runs can leave accessibility reports from earlier runs. Files under `docs/evidence/` are retained snapshots and are not refreshed by running tests. GitHub Actions uploads available evidence on success or failure. [Improvement recommendations](IMPROVEMENTS.md).
