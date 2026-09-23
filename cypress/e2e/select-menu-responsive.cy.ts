import { multipleSelections } from '../data/select-menu';
import { SelectMenuPage } from '../pages/select-menu.page';
import { expectElementInView } from '../support/assertions/layout';

const viewports = [
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
] as const;

describe('Select Menu responsive layout', () => {
  for (const { width, height } of viewports) {
    it(
      `keeps custom multiple selection and removal usable at ${width}x${height}`,
      { viewportWidth: width, viewportHeight: height },
      () => {
        const selectMenuPage = new SelectMenuPage();

        selectMenuPage.visit();
        selectMenuPage.getCustomControl('multiple').scrollIntoView();
        selectMenuPage
          .getCustomControl('multiple')
          .should('be.visible')
          .and(expectElementInView);
        selectMenuPage.openCustomMenu('multiple');

        for (const color of [
          multipleSelections.removed,
          multipleSelections.retained,
        ]) {
          selectMenuPage.getOption(color).scrollIntoView();
          selectMenuPage
            .getOption(color)
            .should('be.visible')
            .and(expectElementInView);
          selectMenuPage.chooseOption(color);
          selectMenuPage.getChip(color).scrollIntoView();
          selectMenuPage
            .getChip(color)
            .should('have.text', color)
            .and('be.visible')
            .and(expectElementInView);
        }

        selectMenuPage.getChips().should('have.length', 2);
        selectMenuPage
          .getRemoveButton(multipleSelections.removed)
          .scrollIntoView();
        selectMenuPage
          .getRemoveButton(multipleSelections.removed)
          .should('be.visible')
          .and(expectElementInView);
        selectMenuPage.removeChip(multipleSelections.removed);

        selectMenuPage.getChips().should('have.length', 1);
        selectMenuPage
          .getRemoveButton(multipleSelections.removed)
          .should('not.exist');
        selectMenuPage.getChip(multipleSelections.retained).scrollIntoView();
        selectMenuPage
          .getChip(multipleSelections.retained)
          .should('have.text', multipleSelections.retained)
          .and('be.visible')
          .and(expectElementInView);
        selectMenuPage.getOption(multipleSelections.removed).scrollIntoView();
        selectMenuPage
          .getOption(multipleSelections.removed)
          .should('be.visible')
          .and(expectElementInView);
        selectMenuPage
          .getOption(multipleSelections.retained)
          .should('not.exist');
      },
    );
  }
});
