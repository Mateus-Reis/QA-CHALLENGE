import {
  emptyTextBoxData,
  invalidEmailTextBoxData,
  markupTextBoxData,
  unicodeTextBoxData,
  updatedTextBoxData,
  validTextBoxData,
} from '../data/text-box';
import type { TextBoxData } from '../data/text-box';
import { TextBoxPage } from '../pages/text-box.page';

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function expectSubmittedValues(
  textBoxPage: TextBoxPage,
  data: TextBoxData,
): void {
  const fields: (keyof TextBoxData)[] = [
    'fullName',
    'email',
    'currentAddress',
    'permanentAddress',
  ];

  textBoxPage.getSubmittedFields().should('have.length', fields.length);

  for (const field of fields) {
    textBoxPage
      .getSubmittedField(field)
      .should('have.length', 1)
      .and('be.visible')
      .and(($result) => {
        const text = $result.text();
        const value = normalizeWhitespace(text.slice(text.indexOf(':') + 1));

        expect(value, `${field} submitted value`).to.equal(
          normalizeWhitespace(data[field]),
        );
      });
  }
}

describe('Text Box', () => {
  it('displays the submitted name, email and addresses', () => {
    const textBoxPage = new TextBoxPage();

    textBoxPage.visit();
    textBoxPage.fillForm(validTextBoxData);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, validTextBoxData);
  });

  it('rejects an invalid email without displaying submitted values', () => {
    const textBoxPage = new TextBoxPage();

    textBoxPage.visit();
    textBoxPage.fillForm(invalidEmailTextBoxData);
    textBoxPage.submit();

    textBoxPage
      .getEmailInput()
      .should('have.class', 'field-error')
      .and('have.value', invalidEmailTextBoxData.email);
    textBoxPage.getSubmittedFields().should('not.exist');
  });

  it('submits successfully after correcting an invalid email', () => {
    const textBoxPage = new TextBoxPage();

    textBoxPage.visit();
    textBoxPage.fillForm(invalidEmailTextBoxData);
    textBoxPage.submit();

    textBoxPage.getEmailInput().should('have.class', 'field-error');
    textBoxPage.getSubmittedFields().should('not.exist');

    textBoxPage.fillEmail(validTextBoxData.email);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, validTextBoxData);
    textBoxPage
      .getEmailInput()
      .should('not.have.class', 'field-error')
      .and('have.value', validTextBoxData.email);
  });

  it('allows submitting empty optional fields', () => {
    const textBoxPage = new TextBoxPage();

    textBoxPage.visit();
    textBoxPage.fillForm(emptyTextBoxData);
    textBoxPage.submit();

    textBoxPage
      .getEmailInput()
      .should('have.value', '')
      .and('not.have.class', 'field-error');
    textBoxPage.getSubmittedFields().should('not.exist');
  });

  it('replaces submitted values and removes them after clearing the form', () => {
    const textBoxPage = new TextBoxPage();

    textBoxPage.visit();
    textBoxPage.fillForm(validTextBoxData);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, validTextBoxData);

    textBoxPage.fillForm(updatedTextBoxData);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, updatedTextBoxData);

    textBoxPage.fillForm(emptyTextBoxData);
    textBoxPage.submit();

    textBoxPage.getSubmittedFields().should('not.exist');
    textBoxPage
      .getEmailInput()
      .should('have.value', '')
      .and('not.have.class', 'field-error');
  });

  it('updates a previous submission after correcting an invalid email', () => {
    const textBoxPage = new TextBoxPage();
    const correctedData: TextBoxData = {
      ...validTextBoxData,
      email: updatedTextBoxData.email,
    };

    textBoxPage.visit();
    textBoxPage.fillForm(validTextBoxData);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, validTextBoxData);

    textBoxPage.fillEmail(invalidEmailTextBoxData.email);
    textBoxPage.submit();

    textBoxPage
      .getEmailInput()
      .should('have.class', 'field-error')
      .and('have.value', invalidEmailTextBoxData.email);

    textBoxPage.fillEmail(correctedData.email);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, correctedData);
    textBoxPage
      .getEmailInput()
      .should('not.have.class', 'field-error')
      .and('have.value', correctedData.email);
  });

  const contentCases = [
    {
      title:
        'preserves accented characters, apostrophes and multiline addresses',
      data: unicodeTextBoxData,
    },
    {
      title: 'renders HTML-like input as plain text',
      data: markupTextBoxData,
    },
  ] as const;

  for (const { title, data } of contentCases) {
    it(title, () => {
      const textBoxPage = new TextBoxPage();

      textBoxPage.visit();
      textBoxPage.fillForm(data);
      textBoxPage.submit();

      expectSubmittedValues(textBoxPage, data);
      textBoxPage
        .getCurrentAddressInput()
        .should('have.value', data.currentAddress);
      textBoxPage.getSubmittedNameBoldElements().should('not.exist');
    });
  }
});
