import { ModalDialogsPage } from '../pages/modal-dialogs.page';
import { expectElementInView } from '../support/assertions/layout';

const viewports = [
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
] as const;

describe('Modal Dialogs responsive layout', () => {
  for (const { width, height } of viewports) {
    it(
      `keeps the large dialog content and dismissal controls reachable at ${width}x${height}`,
      { viewportWidth: width, viewportHeight: height },
      () => {
        const modalDialogsPage = new ModalDialogsPage();

        modalDialogsPage.visit();
        modalDialogsPage.getOpenButton('large').scrollIntoView();
        modalDialogsPage
          .getOpenButton('large')
          .should('be.visible')
          .and(expectElementInView);
        modalDialogsPage.open('large');

        modalDialogsPage
          .getDialog()
          .should('be.visible')
          .and(($dialog) => {
            expect(
              $dialog[0].getAnimations({ subtree: true }),
              'opening transition has finished',
            ).to.be.empty;
            expect(
              $dialog[0].scrollWidth,
              'dialog content width',
            ).to.be.at.most($dialog[0].clientWidth + 1);
          });
        modalDialogsPage.getBody().scrollIntoView();
        modalDialogsPage
          .getBody()
          .should('contain.text', 'including versions of Lorem Ipsum.')
          .and(expectElementInView)
          .and(($body) => {
            const body = $body[0];
            expect(body.scrollWidth, 'body content width').to.be.at.most(
              body.clientWidth + 1,
            );
            expect(body.scrollHeight, 'body content height').to.be.at.most(
              body.clientHeight + 1,
            );
          });
        modalDialogsPage.getCloseButton('footer').scrollIntoView();
        modalDialogsPage
          .getCloseButton('footer')
          .should('be.visible')
          .and(expectElementInView);
        modalDialogsPage.close('footer');
        modalDialogsPage.getDialog().should('not.exist');

        modalDialogsPage.open('large');
        modalDialogsPage
          .getDialog()
          .should('be.visible')
          .and(($dialog) => {
            expect(
              $dialog[0].getAnimations({ subtree: true }),
              'opening transition has finished',
            ).to.be.empty;
          });
        modalDialogsPage.getCloseButton('header').scrollIntoView();
        modalDialogsPage
          .getCloseButton('header')
          .should('be.visible')
          .and(expectElementInView);
        modalDialogsPage.close('header');
        modalDialogsPage.getDialog().should('not.exist');
      },
    );
  }
});
