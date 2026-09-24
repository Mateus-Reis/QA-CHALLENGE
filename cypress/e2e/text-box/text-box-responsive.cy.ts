import { textBoxFields, validTextBoxData } from '../../data/text-box';
import { TextBoxPage } from '../../pages/text-box.page';
import { expectElementInView } from '../../support/assertions/layout';
import { expectSubmittedValues } from '../../support/assertions/text-box';

const viewports = [
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
] as const;

describe('Text Box responsive layout', () => {
  for (const { width, height } of viewports) {
    it(
      `keeps the submission flow usable at ${width}x${height}`,
      { viewportWidth: width, viewportHeight: height },
      () => {
        const textBoxPage = new TextBoxPage();

        textBoxPage.visit();

        textBoxPage.fillForm(validTextBoxData);

        for (const field of textBoxFields) {
          textBoxPage.getInput(field).scrollIntoView();
          textBoxPage
            .getInput(field)
            .should('have.value', validTextBoxData[field])
            .and('be.visible')
            .and(expectElementInView);
        }

        textBoxPage.getSubmitButton().scrollIntoView();
        textBoxPage
          .getSubmitButton()
          .should('be.visible')
          .and(expectElementInView);
        textBoxPage.submit();

        expectSubmittedValues(textBoxPage, validTextBoxData);

        for (const field of textBoxFields) {
          textBoxPage.getSubmittedField(field).scrollIntoView();
          textBoxPage
            .getSubmittedField(field)
            .should('be.visible')
            .and(expectElementInView)
            .and(($result) => {
              const element = $result[0];

              expect(
                element.scrollWidth,
                `${field} content width`,
              ).to.be.at.most(element.clientWidth + 1);
              expect(
                element.scrollHeight,
                `${field} content height`,
              ).to.be.at.most(element.clientHeight + 1);
            });
        }
      },
    );
  }
});
