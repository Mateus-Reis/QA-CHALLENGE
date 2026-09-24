import { checkAccessibility } from './assertions/accessibility';

declare global {
  namespace Cypress {
    interface Chainable {
      fillField(selector: string, value: string): Chainable<void>;
      checkAccessibility(reportName: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('fillField', (selector: string, value: string) => {
  cy.get(selector).clear();

  if (value !== '') {
    cy.get(selector).type(value);
  }
});

Cypress.Commands.add(
  'checkAccessibility',
  { prevSubject: 'element' },
  (subject, reportName: string) => {
    checkAccessibility(subject[0], reportName);
  },
);
