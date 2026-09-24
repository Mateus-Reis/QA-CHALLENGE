import { ModalDialogsPage } from '../pages/modal-dialogs.page';
import { checkAccessibility } from '../support/assertions/accessibility';
import { expectFocusShadow } from '../support/assertions/focus';

function expectFocusInsideDialog($dialog: JQuery<HTMLElement>): void {
  const dialog = $dialog[0];
  const document = dialog.ownerDocument;
  const activeElement = document.activeElement;

  expect(
    dialog.contains(activeElement),
    `focus remains inside the dialog; active=${activeElement?.tagName}#${activeElement?.id}; document.hasFocus=${document.hasFocus()}`,
  ).to.equal(true);
}

describe('Modal Dialogs accessibility', () => {
  for (const size of ['small', 'large'] as const) {
    let modalDialogsPage: ModalDialogsPage;

    describe(`${size} modal`, () => {
      beforeEach(() => {
        modalDialogsPage = new ModalDialogsPage();
        modalDialogsPage.visit();
        modalDialogsPage.open(size);
        modalDialogsPage
          .getDialog()
          .should('be.visible')
          .and('have.attr', 'aria-modal', 'true');
        modalDialogsPage.getDialog().should(($dialog) => {
          expect(
            $dialog[0].getAnimations({ subtree: true }),
            'opening transition has finished',
          ).to.be.empty;
        });
      });

      it('moves focus into the dialog and returns it to the opener after Escape', () => {
        modalDialogsPage.getDialog().should(expectFocusInsideDialog);

        cy.realPress('Escape');
        modalDialogsPage.getDialog().should('not.exist');
        modalDialogsPage.getOpenButton(size).should('have.focus');
      });

      it('keeps forward Tab navigation inside the dialog with visible focus', () => {
        const unfocusedShadows: Record<string, string> = {};

        modalDialogsPage.getDialog().then(($dialog) => {
          if ($dialog[0].ownerDocument.activeElement !== $dialog[0]) {
            cy.wrap($dialog).focus();
          }
        });
        for (const location of ['header', 'footer'] as const) {
          modalDialogsPage
            .getCloseButton(location)
            .should(($button) => {
              expect($button[0].getAnimations(), 'blur transition has finished')
                .to.be.empty;
            })
            .then(($button) => {
              unfocusedShadows[location] = $button.css('box-shadow');
            });
        }

        modalDialogsPage.getCloseButton('header').focus();
        modalDialogsPage
          .getCloseButton('header')
          .should('have.focus')
          .and(($button) =>
            expectFocusShadow($button, unfocusedShadows.header),
          );
        cy.realPress('Tab');
        modalDialogsPage
          .getCloseButton('footer')
          .should('have.focus')
          .and(($button) =>
            expectFocusShadow($button, unfocusedShadows.footer),
          );
        cy.realPress('Tab');
        modalDialogsPage.getDialog().should(expectFocusInsideDialog);
      });

      it('keeps reverse Shift+Tab navigation inside the dialog', () => {
        modalDialogsPage.getCloseButton('header').focus();
        modalDialogsPage.getCloseButton('header').should('have.focus');
        cy.realPress(['Shift', 'Tab']);
        modalDialogsPage.getDialog().should(expectFocusInsideDialog);
        cy.realPress(['Shift', 'Tab']);
        modalDialogsPage.getDialog().should(expectFocusInsideDialog);
      });

      it('has no WCAG 2.1 A or AA axe violations while open', () => {
        modalDialogsPage
          .getDialog()
          .then(($dialog) =>
            checkAccessibility($dialog[0], `modal-dialogs-${size}-open`),
          );
      });
    });
  }
});
