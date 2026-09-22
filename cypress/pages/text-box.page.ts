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
    cy.get(this.selectors.fullName).clear();
    cy.get(this.selectors.fullName).type(data.fullName);

    cy.get(this.selectors.email).clear();
    cy.get(this.selectors.email).type(data.email);

    cy.get(this.selectors.currentAddress).clear();
    cy.get(this.selectors.currentAddress).type(data.currentAddress);

    cy.get(this.selectors.permanentAddress).clear();
    cy.get(this.selectors.permanentAddress).type(data.permanentAddress);
  }

  submit(): void {
    cy.get(this.selectors.submit).click();
  }

  getSubmittedField(
    field: keyof TextBoxData,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.output).find(this.selectors.results[field]);
  }
}
