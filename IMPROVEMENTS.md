# Recommendations

## CI and feedback

The included GitHub Actions workflow installs the locked dependencies, checks TypeScript and formatting, runs the main suite as the gating step, and then runs the accessibility audit. The audit step itself does not block, but a baseline check fails the job when the audit's failures differ from the known defects, so accessibility regressions still block merges. Reports, logs, and failure screenshots from both suites are uploaded even when tests fail. When a defect is fixed, remove it from the baseline; once none remain, make the audit a gating step.

For a larger suite, run a fast smoke subset on every pull request and the full regression on merge to `main` and on a nightly schedule, since the public site can change without a commit in this repository. Use the environment metadata in the results JSON to compare local and hosted runs, and pin the browser and Node versions if hosted image updates make comparisons unreliable.

## Suite organization

Suites are selected with a Cypress env flag (`--env suite=accessibility`), so specs stay grouped by page while the main suite and the audit run separately. When a smoke subset is needed, add tags with `@cypress/grep` instead of new folders, and keep functional, responsive, and accessibility concerns in separate specs.

Parallelize by spec file after measuring durations, balance the slowest files across machines, and give each job a distinct artifact name. Do not share page state or mutable test data between jobs.

## Test data and maintainability

Keep deterministic, typed data modules for the current client-side examples. Add fixtures for file inputs or response samples when a test needs them. For an application with persistent state, create isolated data through a supported API and clean it up after use. Store credentials in environment-specific secrets, never in committed data or reports.

Prefer stable IDs and scoped roles. Ask application developers for explicit test attributes where generated classes or positional selectors are the only option, as with React Select. Review page objects when the application changes, and extract helpers or custom commands only when several scenarios need the same behavior.

## Accessibility and reliability

Supplement axe scans with screen-reader testing, focus visibility and contrast review, and error-announcement checks. Viewport resizing does not replace real mobile devices or touch input. Expand the browser matrix according to product usage rather than duplicating every case.

Keep third-party hosts blocked unless a test targets them. Treat any test that passes only on retry as flaky: record it, investigate it, and do not raise the retry count to hide it. Keep an unexplained failure running and linked to its defect, as done for MD-01, instead of skipping it, and review the known failures on a fixed schedule.

## Metrics

Track executed, passed, failed, pending, and skipped tests per suite; first-attempt pass rate and tests that needed a retry; failure causes (application defect, automation error, environment); total and slowest-spec duration; the number and age of known failures in the baseline; defect recurrence; and time to investigate failures. A pass rate alone does not describe coverage or accessibility conformance.
