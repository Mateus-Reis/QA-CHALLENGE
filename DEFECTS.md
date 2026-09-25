# Defect report

Observed on 2026-09-23 against the public DemoQA application using Chrome on macOS. These findings describe the observed version of the site. Severity describes user impact; priority is a proposed order for remediation.

The accessibility audit (`npm run test:a11y`) reproduces TB-01, SM-01, and SM-02 as five failing tests and MD-01 as two more, locally on macOS and in the [latest GitHub Actions run](https://github.com/Mateus-Reis/QA-CHALLENGE/actions/runs/36154739471) on Linux. The invalid-email feedback finding and standalone focus investigation below are based on local evidence.

## TB-01: Text Box labels are not associated with their fields

**URL:** <https://demoqa.com/text-box>  
**Severity:** High. Permanent Address has no accessible name, preventing assistive-technology users from reliably identifying the field.  
**Priority:** P1. Basic form identification should be corrected before further accessibility improvements.

**Steps to reproduce**

1. Open Text Box.
2. Inspect the Full Name, Email, Current Address, and Permanent Address labels and controls.
3. Run an axe WCAG 2.1 A/AA scan on `#userForm`.
4. Fill the fields with valid values, submit, and scan the same region again.

**Expected:** Each visible label is associated with its field, and every field has an accessible name describing its purpose.

**Actual:** The four labels have no `for` attribute, do not wrap the controls, and are not referenced by `aria-labelledby`. The controls have no `aria-label`. The first three controls have placeholders that satisfy the automatic naming rule, but Permanent Address has no naming fallback. Axe reports the `label` violation on that textarea both before and after submission, with an engine impact of `critical`.

**Evidence:** [Captured form and label associations](docs/evidence/text-box-labels.json). The label-association test and two axe tests in the accessibility audit (`cypress/e2e/text-box/text-box-accessibility.cy.ts`) fail. The two axe failures reproduce the same defect in different states; they are not separate defects. Run `npm run test:a11y -- --spec cypress/e2e/text-box/text-box-accessibility.cy.ts` to regenerate the detailed axe reports and failure screenshots.

## TB-02: Invalid email feedback provides no textual explanation

**URL:** <https://demoqa.com/text-box>  
**Severity:** Medium. A user who cannot distinguish the red border receives no visible explanation of the rejected input.  
**Priority:** P2. Clear error feedback improves identification and recovery from a common form mistake.

**Steps to reproduce**

1. Open a fresh Text Box page.
2. Enter `invalid-email` in Email.
3. Activate Submit.
4. Inspect the email field and surrounding form content.

**Expected:** The rejected email is identified and explained in text, with an appropriate field association or accessible error summary.

**Actual:** The email input receives the `field-error` class and a red border. No explanatory text appears in the form. The `type="button"` Submit control does not show a native validation popup in this interaction. The native email input can expose invalidity and a validation message internally; this does not demonstrate that the message was presented or announced.

**Evidence:** [Screenshot](docs/evidence/text-box-invalid-email.png) and [form HTML after rejection](docs/evidence/text-box-invalid-email.html). This finding comes from inspection of the captured DOM and screenshot after exercising the form. It is not an automated accessibility assertion, and screen-reader announcements have not been assessed.

## SM-01: Select Menu controls have no accessible names

**URL:** <https://demoqa.com/select-menu>  
**Severity:** High. Assistive-technology users cannot reliably identify the purpose of the selection controls.  
**Priority:** P1. All five controls on the selected page are affected.

**Steps to reproduce**

1. Open Select Menu and expand Select Value.
2. Run axe with the WCAG 2.1 A/AA tags on `#selectMenuContainer`.
3. Select a grouped option and two custom multiselect values, dismiss the menu, and repeat the scan.

**Expected:** Each selection control has an accessible name identifying its purpose.

**Actual:** The three custom combobox inputs fail the `label` rule. Old Style Select Menu and Standard multi select fail `select-name`. Visible captions are not programmatically associated with the corresponding controls. The same five elements are reported in both scanned states; axe rates these rules `critical`.

**Evidence:** [Open-state axe report](docs/evidence/select-menu-open.json) and [selected-state axe report](docs/evidence/select-menu-selected.json). Generated IDs in the reports identify the captured DOM, not the locators used by the tests. Run `npm run test:a11y -- --spec cypress/e2e/select-menu/select-menu-accessibility.cy.ts` to reproduce the two failing scans.

## SM-02: Group headings have insufficient text contrast

**URL:** <https://demoqa.com/select-menu>  
**Severity:** Medium. Low-contrast text makes the option groups harder to distinguish for users with low vision.  
**Priority:** P2. Correct the heading color alongside the control-labeling work.

**Steps to reproduce**

1. Open Select Menu.
2. Expand Select Value.
3. Inspect the Group 1 and Group 2 headings or run the scoped axe scan.

**Expected:** Normal-size heading text meets a contrast ratio of at least 4.5:1.

**Actual:** Both 12px, normal-weight headings use `#999999` on `#ffffff`. Axe calculates 2.84:1 and reports `color-contrast` with impact `serious`. The headings are absent from the closed-menu state, so this violation is specific to the open-state scan.

**Evidence:** [Open-state axe report](docs/evidence/select-menu-open.json), including colors, measured ratio, affected nodes, and the rule reference. This defect and SM-01 contribute to the same failing open-state test; test failures and distinct defects have different counts.

## MD-01: Forward focus containment fails in the Cypress runner

**URL:** <https://demoqa.com/modal-dialogs>  
**Status:** Observed failure; application versus runner influence remains unresolved.  
**Provisional severity:** Medium. Keyboard focus leaves the open dialog instead of cycling through its controls.  
**Priority:** P2. Isolate the environment-dependent behavior before selecting an application or automation fix.

**Steps to reproduce in Cypress**

1. Run `npm run test:a11y -- --spec cypress/e2e/modal-dialogs/modal-dialogs-accessibility.cy.ts` in Chrome.
2. Open either modal and establish focus on the header Close button.
3. Press Tab to reach the footer Close button, then Tab again.
4. Check whether the active element remains inside the dialog.

**Expected:** Focus stays within the open modal. The [WAI-ARIA modal-dialog interaction pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) describes wrapping keyboard navigation within the dialog.

**Actual in the runner:** Both sizes leave `activeElement` on `BODY`, with `document.hasFocus()` true and the dialog still open. The assertion keeps failing for the whole retry window. A comparison using Cypress's native `cy.press` reproduced the same result as `cy.realPress`, so the observation is not specific to one keyboard command. Blocking the ad hosts did not change the result.

**Investigation boundary:** In a separate Chrome session outside Cypress, the forward sequence recovered to the dialog container during a condition-based wait. A reverse sequence in Large Modal instead remained on an advertising iframe outside the dialog. These are different observations, not identical standalone reproduction of the runner failure. Do not label this as an axe violation or a confirmed application-only cause. Initial focus and focus return after Escape passed separately.

**Evidence:** [Small modal runner state](docs/evidence/modal-small-focus.json), [large modal runner state](docs/evidence/modal-large-focus.json), and [standalone comparison](docs/evidence/modal-standalone-focus.json). The two tests stay enabled and are listed as known failures in the CI baseline, so the discrepancy stays visible without failing the build. Remove them from the baseline once the cause is isolated and fixed.

## Automated checks requiring manual review

The Select Menu open-state scan returned `incomplete` entries for `aria-valid-attr-value` and `color-contrast`; the selected-state scan also has incomplete contrast checks. Each open-modal scan returned an incomplete contrast check because axe could not determine the background where elements partially overlapped. These entries are retained in the JSON reports and are not counted as either proven violations or verified conformance. Screen-reader announcements, full visual contrast review, and real-device interaction remain outside the executed coverage.
