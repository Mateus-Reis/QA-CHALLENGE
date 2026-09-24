import type { PracticeFormData } from '../data/practice-form';

export type PracticeFormField =
  'firstName' | 'lastName' | 'email' | 'gender' | 'mobile';

export class PracticeFormPage {
  private readonly selectors = {
    form: '#userForm',
    fields: {
      firstName: '#firstName',
      lastName: '#lastName',
      email: '#userEmail',
      gender: 'input[name="gender"]',
      mobile: '#userNumber',
    },
    genderLabels: {
      Male: 'label[for="gender-radio-1"]',
      Female: 'label[for="gender-radio-2"]',
      Other: 'label[for="gender-radio-3"]',
    },
    hobbyLabels: {
      Sports: 'label[for="hobbies-checkbox-1"]',
      Reading: 'label[for="hobbies-checkbox-2"]',
      Music: 'label[for="hobbies-checkbox-3"]',
    },
    currentAddress: 'textarea#currentAddress',
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
    const { fields } = this.selectors;

    cy.fillField(fields.firstName, data.firstName);
    cy.fillField(fields.lastName, data.lastName);
    cy.fillField(fields.email, data.email);
    cy.fillField(fields.mobile, data.mobile);
    cy.get(this.selectors.genderLabels[data.gender]).click();

    for (const hobby of data.hobbies) {
      cy.get(this.selectors.hobbyLabels[hobby]).click();
    }

    cy.fillField(this.selectors.currentAddress, data.currentAddress);
  }

  typeMobileWithKeyboard(mobile: string): void {
    cy.get(this.selectors.fields.mobile).focus();
    cy.realType(mobile);
  }

  submit(): void {
    cy.get(this.selectors.submit).click();
  }

  getForm(): Cypress.Chainable<JQuery<HTMLFormElement>> {
    return cy.get<HTMLFormElement>(this.selectors.form);
  }

  getField(
    field: PracticeFormField,
  ): Cypress.Chainable<JQuery<HTMLInputElement>> {
    return cy.get<HTMLInputElement>(this.selectors.fields[field]);
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
}
