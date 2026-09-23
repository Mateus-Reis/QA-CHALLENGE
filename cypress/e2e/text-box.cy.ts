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
import { expectSubmittedValues } from '../support/assertions/text-box';

describe('Text Box', () => {
  let textBoxPage: TextBoxPage;

  beforeEach(() => {
    textBoxPage = new TextBoxPage();
    textBoxPage.visit();
  });

  it('displays the submitted name, email and addresses', () => {
    textBoxPage.fillForm(validTextBoxData);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, validTextBoxData);
  });

  it('rejects an invalid email without displaying submitted values', () => {
    textBoxPage.fillForm(invalidEmailTextBoxData);
    textBoxPage.submit();

    textBoxPage
      .getEmailInput()
      .should('have.class', 'field-error')
      .and('have.value', invalidEmailTextBoxData.email);
    textBoxPage.getSubmittedFields().should('not.exist');
  });

  it('submits successfully after correcting an invalid email', () => {
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
    textBoxPage.fillForm(emptyTextBoxData);
    textBoxPage.submit();

    textBoxPage
      .getEmailInput()
      .should('have.value', '')
      .and('not.have.class', 'field-error');
    textBoxPage.getSubmittedFields().should('not.exist');
  });

  it('replaces submitted values and removes them after clearing the form', () => {
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
    const correctedData: TextBoxData = {
      ...validTextBoxData,
      email: updatedTextBoxData.email,
    };

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

  it('preserves accented characters, apostrophes and multiline addresses', () => {
    textBoxPage.fillForm(unicodeTextBoxData);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, unicodeTextBoxData);
    textBoxPage
      .getCurrentAddressInput()
      .should('have.value', unicodeTextBoxData.currentAddress);
  });

  it('renders HTML-like input as plain text', () => {
    textBoxPage.fillForm(markupTextBoxData);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, markupTextBoxData);
    textBoxPage.getSubmittedNameBoldElements().should('not.exist');
  });
});
