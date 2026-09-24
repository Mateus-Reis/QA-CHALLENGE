import {
  invalidMobileNumbers,
  requiredPracticeFormFields,
  validPracticeFormData,
} from '../../data/practice-form';
import { PracticeFormPage } from '../../pages/practice-form.page';

describe('Practice Form', () => {
  let practiceFormPage: PracticeFormPage;

  beforeEach(() => {
    practiceFormPage = new PracticeFormPage();
    practiceFormPage.visit();
  });

  it('confirms the submitted student details', () => {
    const data = validPracticeFormData;

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
    practiceFormPage
      .getSubmittedValue('Hobbies')
      .should('have.text', data.hobbies.join(', '));
    practiceFormPage
      .getSubmittedValue('Address')
      .should('have.text', data.currentAddress);
  });

  it('blocks an empty submission and flags the required fields', () => {
    practiceFormPage.submit();

    practiceFormPage.getForm().should('have.class', 'was-validated');

    for (const field of requiredPracticeFormFields) {
      practiceFormPage.getField(field).should(($controls) => {
        expect($controls.length, `${field} controls`).to.be.greaterThan(0);

        for (const control of $controls.toArray()) {
          expect(control.validity.valueMissing, `${field} is missing`).to.equal(
            true,
          );
        }
      });
    }

    practiceFormPage
      .getField('email')
      .should(($email) => expect($email[0].validity.valid).to.equal(true));
    practiceFormPage.getSummaryDialog().should('not.exist');
  });

  for (const mobile of invalidMobileNumbers) {
    it(`rejects a mobile number with ${mobile.description}`, () => {
      practiceFormPage.fillForm({ ...validPracticeFormData, mobile: '' });
      practiceFormPage.typeMobileWithKeyboard(mobile.value);
      practiceFormPage.submit();

      practiceFormPage.getForm().should('have.class', 'was-validated');
      practiceFormPage
        .getField('mobile')
        .should('have.value', mobile.value)
        .and(($mobile) => {
          expect(
            $mobile[0].validity[mobile.validity],
            `mobile ${mobile.validity}`,
          ).to.equal(true);
        });
      practiceFormPage.getSummaryDialog().should('not.exist');
    });
  }
});
