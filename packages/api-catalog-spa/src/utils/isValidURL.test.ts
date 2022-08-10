import { isValidURL } from './isValidURL';

describe('isValidURL test', () => {
  // URL works differently in jest so new URL wont work in jest
  // REF: https://github.com/facebook/jest/issues/10045
  test('should be true for valid URL', () => {
    const test = isValidURL('https://test.com');
    expect(test).toBeTruthy();
  });
});
