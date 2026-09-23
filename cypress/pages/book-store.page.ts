export class BookStorePage {
  private readonly selectors = {
    searchInput: '#searchBox',
    table: '.books-wrapper table',
    rows: 'tbody tr',
    title: 'tbody a',
    row: 'tr',
    authorCell: 'td:nth-child(3)',
  } as const;

  visit(): void {
    cy.visit('/books');
  }

  getSearchInput(): Cypress.Chainable<JQuery<HTMLInputElement>> {
    return cy.get<HTMLInputElement>(this.selectors.searchInput);
  }

  getBookRows(): Cypress.Chainable<JQuery<HTMLTableRowElement>> {
    return cy
      .get(this.selectors.table)
      .find<HTMLTableRowElement>(this.selectors.rows);
  }

  getBookTitle(title: string): Cypress.Chainable<JQuery<HTMLAnchorElement>> {
    return cy
      .get(this.selectors.table)
      .contains<HTMLAnchorElement>(
        this.selectors.title,
        new RegExp(`^${Cypress._.escapeRegExp(title)}$`),
      );
  }

  getBookAuthor(
    title: string,
  ): Cypress.Chainable<JQuery<HTMLTableCellElement>> {
    return this.getBookTitle(title)
      .closest(this.selectors.row)
      .find<HTMLTableCellElement>(this.selectors.authorCell);
  }

  searchFor(title: string): void {
    this.getSearchInput().clear();
    this.getSearchInput().type(title);
  }

  clearSearch(): void {
    this.getSearchInput().clear();
  }
}
