export const groupedSelections = {
  first: 'Group 1, option 1',
  keyboardCandidate: 'Group 1, option 2',
  replacement: 'Group 2, option 2',
} as const;

export const multipleSelections = {
  removed: 'Green',
  retained: 'Blue',
} as const;

export const nativeColors = {
  initial: { label: 'Red', value: 'red' },
  replacements: [
    { label: 'Blue', value: '1' },
    { label: 'Green', value: '2' },
  ],
} as const;
