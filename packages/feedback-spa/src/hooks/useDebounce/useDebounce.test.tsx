import { render, screen, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers('modern');

const UseDebounceTest = ({ text }: { text?: string }) => {
  const debouncedState = useDebounce(text, 1000);
  return <div>{debouncedState}</div>;
};

UseDebounceTest.defaultProps = {
  text: 'hello',
};

test('has initial value', () => {
  render(<UseDebounceTest />);
  const textEl = screen.getByText(/hello/i);
  expect(textEl).toBeInTheDocument();
});

test('update after timeout', async () => {
  // inital state
  const { rerender } = render(<UseDebounceTest />);
  let textEl = screen.getByText(/hello/i);
  expect(textEl).toBeInTheDocument();
  act(() => {
    // prop change
    rerender(<UseDebounceTest text="hello world" />);
  });
  // should not immediately change
  textEl = screen.getByText(/hello/i);
  expect(textEl).toBeInTheDocument();

  act(() => {
    jest.runAllTimers();
  });
  // should be changed
  textEl = screen.getByText(/hello world/i);
  expect(textEl).toBeInTheDocument();
});
