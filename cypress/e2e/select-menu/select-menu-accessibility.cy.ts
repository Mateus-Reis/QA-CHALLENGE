import { groupedSelections, multipleSelections } from '../../data/select-menu';
import { SelectMenuPage } from '../../pages/select-menu.page';
import { expectFocusShadow } from '../../support/assertions/focus';

describe('Select Menu accessibility', () => {
  let selectMenuPage: SelectMenuPage;

  beforeEach(() => {
    selectMenuPage = new SelectMenuPage();
    selectMenuPage.visit();
  });

  it('selects a grouped option with the keyboard and preserves it when Escape dismisses the list', () => {
    selectMenuPage.getCustomInput('grouped').focus();
    cy.realPress('ArrowDown');

    selectMenuPage
      .getCustomInput('grouped')
      .should('have.focus')
      .and('have.attr', 'aria-expanded', 'true');
    selectMenuPage.getListbox().should('be.visible');
    cy.realPress('Enter');

    selectMenuPage
      .getSingleValue('grouped')
      .should('have.text', groupedSelections.first);
    selectMenuPage
      .getCustomInput('grouped')
      .should('have.attr', 'aria-expanded', 'false');
    cy.realPress('ArrowDown');
    cy.realPress('ArrowDown');

    selectMenuPage.getListbox().should('be.visible');

    // react-select announces the focused option through its live region on
    // Apple platforms and through aria-activedescendant everywhere else.
    if (Cypress.platform === 'darwin') {
      selectMenuPage
        .getFocusedAnnouncement('grouped')
        .should('have.text', `${groupedSelections.keyboardCandidate}, 2 of 6.`);
    } else {
      selectMenuPage
        .getOption(groupedSelections.keyboardCandidate)
        .should('be.visible')
        .then(($option) => {
          selectMenuPage
            .getCustomInput('grouped')
            .should('have.attr', 'aria-activedescendant', $option[0].id);
        });
    }

    selectMenuPage
      .getSingleValue('grouped')
      .should('have.text', groupedSelections.first);
    cy.realPress('Escape');

    selectMenuPage
      .getCustomInput('grouped')
      .should('have.focus')
      .and('have.attr', 'aria-expanded', 'false');
    selectMenuPage.getListbox().should('not.exist');
    selectMenuPage
      .getSingleValue('grouped')
      .should('have.text', groupedSelections.first);
  });

  it('moves between controls with Tab and Shift+Tab and displays custom focus indicators', () => {
    const unfocusedShadows: Record<string, string> = {};

    for (const control of ['grouped', 'title', 'multiple'] as const) {
      selectMenuPage.getCustomControl(control).then(($control) => {
        unfocusedShadows[control] = $control.css('box-shadow');
      });
    }

    selectMenuPage.getCustomInput('grouped').focus();
    selectMenuPage.getCustomInput('grouped').should('have.focus');
    selectMenuPage
      .getCustomControl('grouped')
      .should('be.visible')
      .and(($control) => expectFocusShadow($control, unfocusedShadows.grouped));
    cy.realPress('Tab');

    selectMenuPage.getCustomInput('title').should('have.focus');
    selectMenuPage
      .getCustomControl('title')
      .should('be.visible')
      .and(($control) => expectFocusShadow($control, unfocusedShadows.title));
    cy.realPress('Tab');
    selectMenuPage.getNativeSelect().should('have.focus');
    cy.realPress('Tab');

    selectMenuPage.getCustomInput('multiple').should('have.focus');
    selectMenuPage
      .getCustomControl('multiple')
      .should('be.visible')
      .and(($control) =>
        expectFocusShadow($control, unfocusedShadows.multiple),
      );
    cy.realPress(['Shift', 'Tab']);
    selectMenuPage.getNativeSelect().should('have.focus');
    cy.realPress(['Shift', 'Tab']);
    selectMenuPage.getCustomInput('title').should('have.focus');
    cy.realPress(['Shift', 'Tab']);
    selectMenuPage.getCustomInput('grouped').should('have.focus');
  });

  it('has no WCAG 2.1 A or AA axe violations with a grouped combobox open', () => {
    selectMenuPage.openCustomMenu('grouped');

    selectMenuPage.getListbox().should('be.visible');
    selectMenuPage.getContainer().checkAccessibility('select-menu-open');
  });

  it('has no WCAG 2.1 A or AA axe violations after selecting values', () => {
    selectMenuPage.openCustomMenu('grouped');
    selectMenuPage.chooseOption(groupedSelections.first);
    selectMenuPage.openCustomMenu('multiple');
    selectMenuPage.chooseOption(multipleSelections.removed);
    selectMenuPage.chooseOption(multipleSelections.retained);
    cy.realPress('Escape');

    selectMenuPage
      .getSingleValue('grouped')
      .should('have.text', groupedSelections.first);
    selectMenuPage.getChips().should('have.length', 2);
    selectMenuPage.getListbox().should('not.exist');
    selectMenuPage.getContainer().checkAccessibility('select-menu-selected');
  });
});
