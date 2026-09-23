import { textBoxFields, validTextBoxData } from '../data/text-box';
import { TextBoxPage } from '../pages/text-box.page';
import { expectSubmittedValues } from '../support/assertions/text-box';

function expectTextBoxElementInView($element: JQuery<HTMLElement>): void {
  const element = $element[0];
  const document = element.ownerDocument;
  const viewport = document.documentElement;
  const bounds = element.getBoundingClientRect();

  expect(
    document.scrollingElement?.scrollLeft,
    'horizontal page scroll',
  ).to.equal(0);
  expect(bounds.left, 'left edge').to.be.at.least(-1);
  expect(bounds.right, 'right edge').to.be.at.most(viewport.clientWidth + 1);
  expect(bounds.top, 'top edge').to.be.at.least(-1);
  expect(bounds.bottom, 'bottom edge').to.be.at.most(viewport.clientHeight + 1);

  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const points = [
    [centerX, centerY],
    [centerX, bounds.top + 2],
    [centerX, bounds.bottom - 2],
    [bounds.left + 2, centerY],
    [bounds.right - 2, centerY],
  ];

  for (const [x, y] of points) {
    expect(
      element.contains(document.elementFromPoint(x, y)),
      `${element.id} unobstructed at (${x}, ${y})`,
    ).to.equal(true);
  }
}

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
            .and(expectTextBoxElementInView);
        }

        textBoxPage.getSubmitButton().scrollIntoView();
        textBoxPage
          .getSubmitButton()
          .should('be.visible')
          .and(expectTextBoxElementInView);
        textBoxPage.submit();

        expectSubmittedValues(textBoxPage, validTextBoxData);

        for (const field of textBoxFields) {
          textBoxPage.getSubmittedField(field).scrollIntoView();
          textBoxPage
            .getSubmittedField(field)
            .should('be.visible')
            .and(expectTextBoxElementInView)
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
