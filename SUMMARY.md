# Test summary

**Verified:** 2026-09-24 locally in Chrome 153 on macOS, and 2026-09-25 in [GitHub Actions](https://github.com/Mateus-Reis/QA-CHALLENGE/actions/runs/36154739471) in Chrome 153 on Linux, with the same results.

## Approach

The suite covers one page from each homepage category: Text Box (Elements), Practice Form (Forms), Modal Dialogs (Alerts, Frame & Windows), Select Menu (Widgets), Selectable (Interactions), and the Book Store catalogue. Page objects centralize selectors and interactions, typed modules hold test data, custom commands (`cy.fillField`, `cy.checkAccessibility`) remove repeated steps, and specs assert outcomes rather than visibility alone.

Specs are split into two suites. The main suite (`npm test`) holds the functional and responsive specs and must pass. The accessibility audit (`npm run test:a11y`) holds keyboard and scoped axe checks (WCAG 2.1 A/AA). It is expected to fail while the reported defects exist, so CI compares its failures with the known defects instead of requiring it to pass: a new failure or a fixed defect fails the build.

## Results

| Suite               | Tests | Passed | Failed | Pending |
| ------------------- | ----: | -----: | -----: | ------: |
| Main                |    26 |     26 |      0 |       0 |
| Accessibility audit |    17 |     10 |      7 |       0 |

The main suite passed in two consecutive runs (25 s and 26 s) without any retry. Five audit failures map to three defects: Text Box labels (TB-01), Select Menu names (SM-01), and Select Menu heading contrast (SM-02). The other two are the modal focus tests (MD-01). Evidence: [main run](docs/evidence/main-suite-run.txt), [audit run](docs/evidence/accessibility-suite-run.txt), [defect report](DEFECTS.md).

## Flakiness and how it is handled

- **Third-party ads.** In 1 of 8 CI runs, the Text Box responsive test at 390 x 844 failed with a 16 px horizontal scroll caused by a Google video ad ([screenshot](docs/evidence/text-box-responsive-ad-overflow.png)). The known Google ad and ad-verification hosts are now blocked with `blockHosts`. Since then, the main suite has passed without retries locally and in both CI runs on `main` ([latest](https://github.com/Mateus-Reis/QA-CHALLENGE/actions/runs/36154739471)). Two runs cannot prove the flake is gone, so the retry and the attempt history stay in place.
- **Transient failures.** The main suite retries once in run mode. The results JSON keeps every attempt, so a test that passes only on retry shows up as flaky instead of disappearing. The audit does not retry, because its known failures are deterministic.
- **Unresolved focus behavior.** Forward Tab navigation leaving the modal has only been observed inside the Cypress runner, and blocking ads did not change it. Those two tests stay enabled and are listed in the CI baseline under MD-01, so the behavior remains visible without failing the build.
- **Waits.** There are no fixed waits. Assertions retry, and focus and dialog checks first wait for CSS transitions to finish.

## Insights and trade-offs

- `cy.type` sets values programmatically, and Chrome applies `minlength` only to values edited by the user. With `cy.type`, the Practice Form accepted a 5-digit mobile number that a real user cannot submit. The invalid mobile tests therefore use native keyboard input from `cypress-real-events`.
- React Select exposes the focused option through `aria-activedescendant`, except on Apple platforms, where it uses its live region. The keyboard test asserts whichever mechanism the platform uses.
- Practice Form does not cover the date picker, subjects, picture upload, or state and city. Book Store covers public search, not login. React Select needs some structural locators because it has no stable IDs.
- Viewport checks do not replace real devices, and axe scans do not establish full accessibility conformance.
