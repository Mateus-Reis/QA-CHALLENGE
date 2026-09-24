import {
  groupedSelections,
  multipleSelections,
  nativeColors,
} from '../../data/select-menu';
import { SelectMenuPage } from '../../pages/select-menu.page';

describe('Select Menu', () => {
  let selectMenuPage: SelectMenuPage;

  beforeEach(() => {
    selectMenuPage = new SelectMenuPage();
    selectMenuPage.visit();
  });

  it('replaces a grouped selection with a different option', () => {
    selectMenuPage.openCustomMenu('grouped');
    selectMenuPage.chooseOption(groupedSelections.first);

    selectMenuPage
      .getSingleValue('grouped')
      .should('have.text', groupedSelections.first);
    selectMenuPage
      .getCustomInput('grouped')
      .should('have.attr', 'aria-expanded', 'false');

    selectMenuPage.openCustomMenu('grouped');
    selectMenuPage.chooseOption(groupedSelections.replacement);

    selectMenuPage
      .getSingleValue('grouped')
      .should('have.length', 1)
      .and('have.text', groupedSelections.replacement);
    selectMenuPage
      .getCustomInput('grouped')
      .should('have.attr', 'aria-expanded', 'false');
    selectMenuPage.getListbox().should('not.exist');
  });

  it('keeps the remaining chip and restores an option after removing one selection', () => {
    selectMenuPage.openCustomMenu('multiple');
    selectMenuPage.chooseOption(multipleSelections.removed);
    selectMenuPage.chooseOption(multipleSelections.retained);

    selectMenuPage.getChips().should('have.length', 2);
    selectMenuPage
      .getChip(multipleSelections.removed)
      .should('have.text', multipleSelections.removed);
    selectMenuPage
      .getChip(multipleSelections.retained)
      .should('have.text', multipleSelections.retained);
    selectMenuPage.getOption(multipleSelections.removed).should('not.exist');
    selectMenuPage.getOption(multipleSelections.retained).should('not.exist');

    selectMenuPage.removeChip(multipleSelections.removed);

    selectMenuPage.getChips().should('have.length', 1);
    selectMenuPage
      .getRemoveButton(multipleSelections.removed)
      .should('not.exist');
    selectMenuPage
      .getChip(multipleSelections.retained)
      .should('have.text', multipleSelections.retained);
    selectMenuPage.getOption(multipleSelections.removed).should('be.visible');
    selectMenuPage.getOption(multipleSelections.retained).should('not.exist');
  });

  it('changes the old-style native selection', () => {
    selectMenuPage
      .getNativeSelect()
      .should('have.value', nativeColors.initial.value);
    selectMenuPage
      .getNativeSelectedOption()
      .should('have.text', nativeColors.initial.label);

    for (const color of nativeColors.replacements) {
      selectMenuPage.chooseNativeColor(color.value);

      selectMenuPage.getNativeSelect().should('have.value', color.value);
      selectMenuPage
        .getNativeSelectedOption()
        .should('have.length', 1)
        .and('have.text', color.label);
    }
  });
});
