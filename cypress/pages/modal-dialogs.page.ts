type ModalSize = 'small' | 'large';
type CloseLocation = 'header' | 'footer';

export class ModalDialogsPage {
  private readonly selectors = {
    openButtons: {
      small: '#showSmallModal',
      large: '#showLargeModal',
    },
    dialog: '[role="dialog"]',
    body: '.modal-body',
    closeButtons: {
      header: '.modal-header button[aria-label="Close"]',
      footer: '.modal-footer button',
    },
  } as const;

  visit(): void {
    cy.visit('/modal-dialogs');
  }

  getOpenButton(size: ModalSize): Cypress.Chainable<JQuery<HTMLButtonElement>> {
    return cy.get<HTMLButtonElement>(this.selectors.openButtons[size]);
  }

  open(size: ModalSize): void {
    this.getOpenButton(size).click();
  }

  getDialog(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get<HTMLElement>(this.selectors.dialog);
  }

  getBody(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getDialog().find<HTMLElement>(this.selectors.body);
  }

  getCloseButton(
    location: CloseLocation,
  ): Cypress.Chainable<JQuery<HTMLButtonElement>> {
    return this.getDialog().find<HTMLButtonElement>(
      this.selectors.closeButtons[location],
    );
  }

  close(location: CloseLocation): void {
    this.getCloseButton(location).click();
  }
}
