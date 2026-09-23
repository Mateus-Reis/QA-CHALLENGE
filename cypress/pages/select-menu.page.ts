type CustomControl = 'grouped' | 'title' | 'multiple';

export class SelectMenuPage {
  private readonly selectors = {
    container: '#selectMenuContainer',
    grouped: '#withOptGroup',
    title: '#selectOne',
    combobox: 'input[role="combobox"]',
    listbox: '[role="listbox"]',
    option: '[role="option"]',
    focusedAnnouncement: '[role="log"] #aria-focused',
    removeButton: '[role="button"][aria-label^="Remove "]',
    nativeSelect: '#oldSelectMenu',
    selectedOption: 'option:selected',
  } as const;

  visit(): void {
    cy.visit('/select-menu');
  }

  getContainer(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.container);
  }

  getCustomInput(
    control: CustomControl,
  ): Cypress.Chainable<JQuery<HTMLInputElement>> {
    if (control === 'multiple') {
      return this.getContainer()
        .find<HTMLInputElement>(this.selectors.combobox)
        .eq(2);
    }

    return cy
      .get(this.selectors[control])
      .find<HTMLInputElement>(this.selectors.combobox);
  }

  getCustomControl(
    control: CustomControl,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getCustomInput(control).parent().parent().parent();
  }

  getSingleValue(
    control: 'grouped' | 'title',
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getCustomControl(control)
      .children()
      .first()
      .children()
      .not('[data-value]');
  }

  openCustomMenu(control: CustomControl): void {
    this.getCustomControl(control).click();
  }

  getListbox(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getContainer().find(this.selectors.listbox);
  }

  getOption(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getListbox().contains(
      this.selectors.option,
      new RegExp(`^${Cypress._.escapeRegExp(label)}$`),
    );
  }

  getFocusedAnnouncement(
    control: CustomControl,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getCustomControl(control)
      .parent()
      .find(this.selectors.focusedAnnouncement);
  }

  chooseOption(label: string): void {
    this.getOption(label).click();
  }

  getRemoveButton(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getContainer().find(
      `[role="button"][aria-label="Remove ${label}"]`,
    );
  }

  getChips(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getContainer().find(this.selectors.removeButton).parent();
  }

  getChip(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getRemoveButton(label).parent();
  }

  removeChip(label: string): void {
    this.getRemoveButton(label).click();
  }

  getNativeSelect(): Cypress.Chainable<JQuery<HTMLSelectElement>> {
    return cy.get<HTMLSelectElement>(this.selectors.nativeSelect);
  }

  getNativeSelectedOption(): Cypress.Chainable<JQuery<HTMLOptionElement>> {
    return this.getNativeSelect().find<HTMLOptionElement>(
      this.selectors.selectedOption,
    );
  }

  chooseNativeColor(value: string): void {
    this.getNativeSelect().select(value);
  }
}
