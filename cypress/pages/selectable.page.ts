export class SelectablePage {
  private readonly selectors = {
    list: '#verticalListContainer',
    item: 'li',
    selectedItems: 'li.active',
  } as const;

  visit(): void {
    cy.visit('/selectable');
  }

  getItem(text: string): Cypress.Chainable<JQuery<HTMLLIElement>> {
    return cy
      .get(this.selectors.list)
      .contains<HTMLLIElement>(
        this.selectors.item,
        new RegExp(`^${Cypress._.escapeRegExp(text)}$`),
      );
  }

  toggleItem(text: string): void {
    this.getItem(text).click();
  }

  getSelectedItems(): Cypress.Chainable<JQuery<HTMLLIElement>> {
    return cy
      .get(this.selectors.list)
      .find<HTMLLIElement>(this.selectors.selectedItems);
  }
}
