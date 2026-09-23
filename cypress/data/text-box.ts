export interface TextBoxData {
  readonly fullName: string;
  readonly email: string;
  readonly currentAddress: string;
  readonly permanentAddress: string;
}

export const textBoxFields: readonly (keyof TextBoxData)[] = [
  'fullName',
  'email',
  'currentAddress',
  'permanentAddress',
];

export const validTextBoxData: TextBoxData = {
  fullName: 'Mateus Reis',
  email: 'mateus.reis@example.com',
  currentAddress: '123 Maple Street',
  permanentAddress: '456 Oak Avenue',
};

export const invalidEmailTextBoxData: TextBoxData = {
  ...validTextBoxData,
  email: 'invalid-email',
};

export const emptyTextBoxData: TextBoxData = {
  fullName: '',
  email: '',
  currentAddress: '',
  permanentAddress: '',
};

export const updatedTextBoxData: TextBoxData = {
  fullName: 'Mateus R.',
  email: 'mateus.r@example.com',
  currentAddress: '789 Cedar Road',
  permanentAddress: '321 Pine Lane',
};

export const unicodeTextBoxData: TextBoxData = {
  ...validTextBoxData,
  fullName: "Zoë O'Connor",
  email: 'zoe.oconnor@example.com',
  currentAddress: '123 Maple Street\nApartment 4B\nLondon',
};

export const markupTextBoxData: TextBoxData = {
  ...validTextBoxData,
  fullName: '<b>Mateus Reis</b>',
};
