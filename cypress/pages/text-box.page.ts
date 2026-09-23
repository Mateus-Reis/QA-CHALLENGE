import type { TextBoxData } from '../data/text-box';

export class TextBoxPage {
  private readonly selectors = {
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

  fillForm(data: TextBoxData): void {
    this.fillField(this.selectors.fullName, data.fullName);
    this.fillField(this.selectors.email, data.email);
    this.fillField(this.selectors.currentAddress, data.currentAddress);
    this.fillField(this.selectors.permanentAddress, data.permanentAddress);
  }

  fillEmail(email: string): void {
    this.fillField(this.selectors.email, email);
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

  getEmailInput(): Cypress.Chainable<JQuery<HTMLInputElement>> {
    return cy.get<HTMLInputElement>(this.selectors.email);
  }

  getCurrentAddressInput(): Cypress.Chainable<JQuery<HTMLTextAreaElement>> {
    return cy.get<HTMLTextAreaElement>(this.selectors.currentAddress);
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

  private fillField(selector: string, value: string): void {
    cy.get(selector).clear();

    if (value !== '') {
      cy.get(selector).type(value);
    }
  }
}
