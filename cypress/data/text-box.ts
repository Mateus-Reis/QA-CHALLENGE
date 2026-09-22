export interface TextBoxData {
  readonly fullName: string;
  readonly email: string;
  readonly currentAddress: string;
  readonly permanentAddress: string;
}

export const validTextBoxData: TextBoxData = {
  fullName: 'Mateus Reis',
  email: 'mateus.reis@example.com',
  currentAddress: '123 Maple Street',
  permanentAddress: '456 Oak Avenue',
};
