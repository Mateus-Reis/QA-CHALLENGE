import { validPracticeFormData } from '../../data/practice-form';
import { PracticeFormPage } from '../../pages/practice-form.page';

describe('Practice Form', () => {
  it('confirms the submitted name, email, gender and mobile number', () => {
    const practiceFormPage = new PracticeFormPage();
    const data = validPracticeFormData;

    practiceFormPage.visit();
    practiceFormPage.fillForm(data);
    practiceFormPage.submit();

    practiceFormPage.getSummaryDialog().should('be.visible');
    practiceFormPage
      .getSummaryTitle()
      .should('have.text', 'Thanks for submitting the form');

    practiceFormPage
      .getSubmittedValue('Student Name')
      .should('have.text', `${data.firstName} ${data.lastName}`);
    practiceFormPage
      .getSubmittedValue('Student Email')
      .should('have.text', data.email);
    practiceFormPage
      .getSubmittedValue('Gender')
      .should('have.text', data.gender);
    practiceFormPage
      .getSubmittedValue('Mobile')
      .should('have.text', data.mobile);
  });
});
