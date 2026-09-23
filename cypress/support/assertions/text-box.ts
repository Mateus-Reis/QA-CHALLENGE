import { textBoxFields } from '../../data/text-box';
import type { TextBoxData } from '../../data/text-box';
import type { TextBoxPage } from '../../pages/text-box.page';

export function expectSubmittedValues(
  textBoxPage: TextBoxPage,
  data: TextBoxData,
): void {
  textBoxPage.getSubmittedFields().should('have.length', textBoxFields.length);

  for (const field of textBoxFields) {
    textBoxPage
      .getSubmittedField(field)
      .should('have.length', 1)
      .and('be.visible')
      .and(($result) => {
        const text = $result.text();
        const value = text.slice(text.indexOf(':') + 1).trim();

        expect(value, `${field} submitted value`).to.equal(data[field]);
      });
  }
}
