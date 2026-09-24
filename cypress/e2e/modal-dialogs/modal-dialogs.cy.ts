import { ModalDialogsPage } from '../../pages/modal-dialogs.page';

describe('Modal Dialogs', () => {
  let modalDialogsPage: ModalDialogsPage;

  beforeEach(() => {
    modalDialogsPage = new ModalDialogsPage();
    modalDialogsPage.visit();
    modalDialogsPage.getDialog().should('not.exist');
  });

  it('opens the named small dialog with its content and closes from the footer', () => {
    modalDialogsPage.open('small');

    modalDialogsPage
      .getDialog()
      .should('be.visible')
      .and(($dialog) => {
        expect(
          $dialog[0].ariaLabelledByElements
            ?.map((element) => element.textContent)
            .join(' '),
        ).to.equal('Small Modal');
      });
    modalDialogsPage
      .getBody()
      .should('have.text', 'This is a small modal. It has very less content');
    modalDialogsPage
      .getCloseButton('header')
      .should('have.attr', 'aria-label', 'Close');
    modalDialogsPage.getCloseButton('footer').should('have.text', 'Close');

    modalDialogsPage.close('footer');
    modalDialogsPage.getDialog().should('not.exist');
  });

  it('opens the named large dialog with its content and closes from the header', () => {
    modalDialogsPage.open('large');

    modalDialogsPage
      .getDialog()
      .should('be.visible')
      .and(($dialog) => {
        expect(
          $dialog[0].ariaLabelledByElements
            ?.map((element) => element.textContent)
            .join(' '),
        ).to.equal('Large Modal');
      });
    modalDialogsPage
      .getBody()
      .should('contain.text', 'Lorem Ipsum is simply dummy text')
      .and('contain.text', 'including versions of Lorem Ipsum.');
    modalDialogsPage
      .getCloseButton('header')
      .should('have.attr', 'aria-label', 'Close');
    modalDialogsPage.getCloseButton('footer').should('have.text', 'Close');

    modalDialogsPage.close('header');
    modalDialogsPage.getDialog().should('not.exist');
  });

  it('dismisses with Escape and reopens the dialog', () => {
    modalDialogsPage.open('small');
    modalDialogsPage.getDialog().should('be.visible');

    cy.realPress('Escape');
    modalDialogsPage.getDialog().should('not.exist');

    modalDialogsPage.open('small');
    modalDialogsPage.getDialog().should('be.visible');
    modalDialogsPage.getBody().should('contain.text', 'This is a small modal.');

    modalDialogsPage.close('footer');
    modalDialogsPage.getDialog().should('not.exist');
  });
});
