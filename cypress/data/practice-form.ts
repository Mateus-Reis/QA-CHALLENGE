export interface PracticeFormData {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly gender: 'Male' | 'Female' | 'Other';
  readonly mobile: string;
}

export const validPracticeFormData: PracticeFormData = {
  firstName: 'Mateus',
  lastName: 'Reis',
  email: 'mateus.reis@example.com',
  gender: 'Other',
  mobile: '0123456789',
};
