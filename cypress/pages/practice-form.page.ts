import type { PracticeFormData } from '../data/practice-form';

export class PracticeFormPage {
  private readonly selectors = {
    firstName: '#firstName',
    lastName: '#lastName',
    email: '#userEmail',
    mobile: '#userNumber',
    genderLabels: {
      Male: 'label[for="gender-radio-1"]',
      Female: 'label[for="gender-radio-2"]',
      Other: 'label[for="gender-radio-3"]',
    },
    submit: '#submit',
    summaryDialog: '[role="dialog"]',
    summaryTitle: '#example-modal-sizes-title-lg',
    summaryLabelCell: 'tbody tr > td:first-child',
    summaryValueCell: 'td',
  } as const;

  visit(): void {
    cy.visit('/automation-practice-form');
  }

  fillForm(data: PracticeFormData): void {
    this.fillField(this.selectors.firstName, data.firstName);
    this.fillField(this.selectors.lastName, data.lastName);
    this.fillField(this.selectors.email, data.email);
    this.fillField(this.selectors.mobile, data.mobile);
    cy.get(this.selectors.genderLabels[data.gender]).click();
  }

  submit(): void {
    cy.get(this.selectors.submit).click();
  }

  getSummaryDialog(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get<HTMLElement>(this.selectors.summaryDialog);
  }

  getSummaryTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getSummaryDialog().find<HTMLElement>(
      this.selectors.summaryTitle,
    );
  }

  getSubmittedValue(
    label: string,
  ): Cypress.Chainable<JQuery<HTMLTableCellElement>> {
    const exactLabel = new RegExp(`^${Cypress._.escapeRegExp(label)}$`);

    return this.getSummaryDialog()
      .contains<HTMLTableCellElement>(
        this.selectors.summaryLabelCell,
        exactLabel,
      )
      .siblings<HTMLTableCellElement>(this.selectors.summaryValueCell);
  }

  private fillField(selector: string, value: string): void {
    cy.get(selector).clear();

    if (value !== '') {
      cy.get(selector).type(value);
    }
  }
}
