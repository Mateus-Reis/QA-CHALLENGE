import type { TextBoxData } from '../data/text-box';

export class TextBoxPage {
  private readonly selectors = {
    form: '#userForm',
    fullName: '#userName',
    email: '#userEmail',
    currentAddress: 'textarea#currentAddress',
    permanentAddress: 'textarea#permanentAddress',
    submit: '#submit',
    output: '#output',
    submittedFields: 'p',
    submittedNameBoldElements: 'b',
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

  getForm(): Cypress.Chainable<JQuery<HTMLFormElement>> {
    return cy.get<HTMLFormElement>(this.selectors.form);
  }

  fillForm(data: TextBoxData): void {
    cy.fillField(this.selectors.fullName, data.fullName);
    cy.fillField(this.selectors.email, data.email);
    cy.fillField(this.selectors.currentAddress, data.currentAddress);
    cy.fillField(this.selectors.permanentAddress, data.permanentAddress);
  }

  fillEmail(email: string): void {
    cy.fillField(this.selectors.email, email);
  }

  submit(): void {
    cy.get(this.selectors.submit).click();
  }

  getInput(
    field: keyof TextBoxData,
  ): Cypress.Chainable<JQuery<HTMLInputElement | HTMLTextAreaElement>> {
    return cy.get<HTMLInputElement | HTMLTextAreaElement>(
      this.selectors[field],
    );
  }

  getSubmitButton(): Cypress.Chainable<JQuery<HTMLButtonElement>> {
    return cy.get<HTMLButtonElement>(this.selectors.submit);
  }

  getSubmittedFields(): Cypress.Chainable<JQuery<HTMLParagraphElement>> {
    return cy.get(this.selectors.output).find(this.selectors.submittedFields);
  }

  getSubmittedField(
    field: keyof TextBoxData,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.output).find(this.selectors.results[field]);
  }

  getSubmittedNameBoldElements(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getSubmittedField('fullName').find(
      this.selectors.submittedNameBoldElements,
    );
  }
}
