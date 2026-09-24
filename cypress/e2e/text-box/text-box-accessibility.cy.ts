import { textBoxFields, validTextBoxData } from '../../data/text-box';
import { TextBoxPage } from '../../pages/text-box.page';
import { checkAccessibility } from '../../support/assertions/accessibility';
import { expectFocusShadow } from '../../support/assertions/focus';
import { expectSubmittedValues } from '../../support/assertions/text-box';

describe('Text Box accessibility', () => {
  let textBoxPage: TextBoxPage;

  beforeEach(() => {
    textBoxPage = new TextBoxPage();
    textBoxPage.visit();
  });

  it('associates visible labels with the form fields', () => {
    const labels = {
      fullName: 'Full Name',
      email: 'Email',
      currentAddress: 'Current Address',
      permanentAddress: 'Permanent Address',
    };

    textBoxPage.getEmailInput().should('have.attr', 'type', 'email');
    textBoxPage.getSubmitButton().should('have.text', 'Submit');

    for (const field of textBoxFields) {
      textBoxPage.getInput(field).should(($input) => {
        const referencedLabels = $input[0].ariaLabelledByElements;
        const associatedLabels = referencedLabels?.length
          ? referencedLabels
          : Array.from($input[0].labels ?? []);
        const label = associatedLabels.find(
          (element) => element.textContent?.trim() === labels[field],
        );

        expect(associatedLabels, `${field} associated labels`).not.to.be.empty;
        expect(label, `${field} label text`).to.exist;
        expect(Cypress.$(label!), `${field} visible label`).to.be.visible;
      });
    }
  });

  it('submits using Tab and Enter with a focus indicator on each control', () => {
    const unfocusedShadows: Record<string, string> = {};

    for (const field of textBoxFields) {
      textBoxPage.getInput(field).then(($input) => {
        unfocusedShadows[field] = $input.css('box-shadow');
      });
    }
    textBoxPage.getSubmitButton().then(($button) => {
      unfocusedShadows.submit = $button.css('box-shadow');
    });

    textBoxPage.getInput('fullName').focus();

    for (const field of textBoxFields) {
      textBoxPage
        .getInput(field)
        .should('have.focus')
        .and('be.visible')
        .and(($input) => expectFocusShadow($input, unfocusedShadows[field]));
      cy.realType(validTextBoxData[field]);
      cy.realPress('Tab');
    }

    textBoxPage
      .getSubmitButton()
      .should('have.focus')
      .and('be.visible')
      .and(($button) => expectFocusShadow($button, unfocusedShadows.submit));
    cy.realPress('Enter');

    expectSubmittedValues(textBoxPage, validTextBoxData);
  });

  it('moves backwards through the form with Shift+Tab', () => {
    textBoxPage.getSubmitButton().focus();

    cy.realPress(['Shift', 'Tab']);
    textBoxPage.getInput('permanentAddress').should('have.focus');
    cy.realPress(['Shift', 'Tab']);
    textBoxPage.getInput('currentAddress').should('have.focus');
    cy.realPress(['Shift', 'Tab']);
    textBoxPage.getEmailInput().should('have.focus');
    cy.realPress(['Shift', 'Tab']);
    textBoxPage.getInput('fullName').should('have.focus');
  });

  it('has no WCAG 2.1 A or AA axe violations in the initial form', () => {
    textBoxPage
      .getForm()
      .should('be.visible')
      .then(($form) => checkAccessibility($form[0], 'text-box-initial'));
  });

  it('has no WCAG 2.1 A or AA axe violations after submission', () => {
    textBoxPage.fillForm(validTextBoxData);
    textBoxPage.submit();

    expectSubmittedValues(textBoxPage, validTextBoxData);
    textBoxPage
      .getForm()
      .should('be.visible')
      .then(($form) => checkAccessibility($form[0], 'text-box-submitted'));
  });
});
