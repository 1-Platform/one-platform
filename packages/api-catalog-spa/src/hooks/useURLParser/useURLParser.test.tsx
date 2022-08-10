import { render, screen } from '@testing-library/react';
import { useURLParser } from './useURLParser';

const UseURLParser = () => {
  const parse = useURLParser();

  return <div>{parse('https://test.com')}</div>;
};

describe('useURLParser tests', () => {
  test('should remove protocol', () => {
    render(<UseURLParser />);
    expect(screen.getByText(/test.com/i)).toBeDefined();
  });
});
