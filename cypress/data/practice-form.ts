export type Gender = 'Male' | 'Female' | 'Other';
export type Hobby = 'Sports' | 'Reading' | 'Music';

export interface PracticeFormData {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly gender: Gender;
  readonly mobile: string;
  readonly hobbies: readonly Hobby[];
  readonly currentAddress: string;
}

export const validPracticeFormData: PracticeFormData = {
  firstName: 'Mateus',
  lastName: 'Reis',
  email: 'mateus.reis@example.com',
  gender: 'Other',
  mobile: '0123456789',
  hobbies: ['Sports', 'Music'],
  currentAddress: '123 Maple Street, London',
};

export const requiredPracticeFormFields = [
  'firstName',
  'lastName',
  'gender',
  'mobile',
] as const;

export const invalidMobileNumbers = [
  { description: 'letters', value: 'abcdefghij', validity: 'patternMismatch' },
  { description: 'fewer than 10 digits', value: '01234', validity: 'tooShort' },
] as const;
