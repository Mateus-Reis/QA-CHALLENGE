# Recommendations

## CI and feedback

The included GitHub Actions workflow is an optional addition to the challenge. It installs the locked dependencies, checks TypeScript and formatting, and runs the full suite in Chrome on pull requests, pushes to `main`, or manual dispatch. The job retains the test exit status and uploads available reports and failure screenshots even when tests fail. Known application defects remain failures; the workflow does not bypass them.

The workflow has not yet been executed on GitHub. Confirm its first hosted run after publication, including artifact downloads and native keyboard events. Capture the browser and Node versions when investigating differences from local runs. Pin the browser and Node patch versions if changes in the hosted image make comparisons unreliable.

## Suite organization

Keep functional, responsive, and accessibility specs separate while sharing small page objects and assertions. Run all selected coverage for this small suite. If execution time grows, use spec patterns to create a fast functional smoke job and broader scheduled regression jobs; preserve the complete results across jobs instead of treating omitted coverage as passed.

Introduce tags only when there is a concrete selection need. Parallelize independent specs after measuring their duration, balance the slowest files, and give each job a distinct artifact name. Do not share page state or mutable test data between jobs.

## Test data and maintainability

Keep deterministic, typed data modules for the current client-side examples. Add fixtures for file inputs or response samples when a test needs them. For an application with persistent state, create isolated data through a supported API and clean it up after use. Store credentials in environment-specific secrets, never in committed data or reports.

Prefer stable IDs and scoped roles. Ask application developers for explicit test attributes where generated classes or positional selectors are the only choices. Review page models when the application changes, and extract helpers only when multiple scenarios need the same behavior.

## Accessibility and reliability

Supplement axe scans with screen-reader testing, focus visibility and contrast assessment, and error-announcement checks. Desktop viewport resizing does not replace real mobile devices or touch input. Expand the browser matrix according to product usage rather than duplicating every case immediately.

Investigate intermittent failures before enabling retries. Distinguish application defects, automation errors, and environment problems; retain the first attempt if retries are later added. A public demonstration site can change independently of this repository, so record the observation date and recheck reported defects.

## Metrics

Track executed, passed, failed, pending, and skipped tests by coverage area; failure causes; total and slowest-spec duration; first-attempt versus retry outcomes; defect recurrence; and time to investigate failures. Compare trends against the same code and configuration. A pass rate alone does not describe coverage or accessibility conformance.
