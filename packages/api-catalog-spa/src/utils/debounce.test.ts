import { debounce } from './debounce';

describe('Debounce test', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should be debounced', () => {
    let test = true;
    const testFn = debounce(() => {
      test = false;
    });

    expect(test).toBeTruthy();
    testFn();

    jest.runAllTimers();

    expect(test).toBeFalsy();
  });
});
