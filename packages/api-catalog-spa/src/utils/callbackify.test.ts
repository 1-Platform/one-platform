import { callbackify } from './callbackify';

describe('Callbackify test', () => {
  test('should trigger callback', () => {
    const fn = jest.fn();
    fn.mockReturnValue(true);
    const test = callbackify(fn, 'arg');
    const testReturn = test();
    // exactly once
    expect(fn.mock.calls.length).toBe(1);
    // argument gets passed
    expect(fn).toBeCalledWith('arg');
    expect(testReturn).toBeTruthy();
  });
});
