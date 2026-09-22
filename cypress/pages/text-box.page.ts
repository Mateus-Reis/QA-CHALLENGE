import type { TextBoxData } from '../data/text-box';

export class TextBoxPage {
  private readonly selectors = {
    fullName: '#userName',
    email: '#userEmail',
    currentAddress: 'textarea#currentAddress',
    permanentAddress: 'textarea#permanentAddress',
    submit: '#submit',
    output: '#output',
    results: {
      fullName: '#name',
      email: '#email',
      currentAddress: 'p#currentAddress',
      permanentAddress: 'p#permanentAddress',
    },
  } as const;

  visit(): void {
    cy.visit('/text-box');
  }

  fillForm(data: TextBoxData): void {
    this.fillField(this.selectors.fullName, data.fullName);
    this.fillField(this.selectors.email, data.email);
    this.fillField(this.selectors.currentAddress, data.currentAddress);
    this.fillField(this.selectors.permanentAddress, data.permanentAddress);
  }

  submit(): void {
    cy.get(this.selectors.submit).click();
  }

  getSubmittedField(
    field: keyof TextBoxData,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.output).find(this.selectors.results[field]);
  }

  private fillField(selector: string, value: string): void {
    cy.get(selector).clear();

    if (value !== '') {
      cy.get(selector).type(value);
    }
  }
}
