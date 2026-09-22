import { validTextBoxData } from '../data/text-box';
import { TextBoxPage } from '../pages/text-box.page';

describe('Text Box', () => {
  it('displays the submitted name, email and addresses', () => {
    const textBoxPage = new TextBoxPage();

    textBoxPage.visit();
    textBoxPage.fillForm(validTextBoxData);
    textBoxPage.submit();

    textBoxPage
      .getSubmittedField('fullName')
      .should('be.visible')
      .and('contain.text', validTextBoxData.fullName);
    textBoxPage
      .getSubmittedField('email')
      .should('be.visible')
      .and('contain.text', validTextBoxData.email);
    textBoxPage
      .getSubmittedField('currentAddress')
      .should('be.visible')
      .and('contain.text', validTextBoxData.currentAddress);
    textBoxPage
      .getSubmittedField('permanentAddress')
      .should('be.visible')
      .and('contain.text', validTextBoxData.permanentAddress);
  });
});
