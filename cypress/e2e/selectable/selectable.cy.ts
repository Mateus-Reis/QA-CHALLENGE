import { listSelections } from '../../data/selectable';
import { SelectablePage } from '../../pages/selectable.page';

describe('Selectable', () => {
  let selectablePage: SelectablePage;

  beforeEach(() => {
    selectablePage = new SelectablePage();
    selectablePage.visit();
  });

  it('deselects one list item while retaining the other selection', () => {
    selectablePage.getSelectedItems().should('not.exist');

    selectablePage.toggleItem(listSelections.removed);
    selectablePage.toggleItem(listSelections.retained);

    selectablePage.getSelectedItems().should('have.length', 2);
    selectablePage
      .getItem(listSelections.removed)
      .should('have.class', 'active');
    selectablePage
      .getItem(listSelections.retained)
      .should('have.class', 'active');

    selectablePage.toggleItem(listSelections.removed);

    selectablePage
      .getItem(listSelections.removed)
      .should('not.have.class', 'active');
    selectablePage
      .getSelectedItems()
      .should('have.length', 1)
      .and('have.text', listSelections.retained);
  });
});
