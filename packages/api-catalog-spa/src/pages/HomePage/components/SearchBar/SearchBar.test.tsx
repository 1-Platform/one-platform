import { render, screen } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('Search Bar', () => {
  test('should render', () => {
    render(<SearchBar value="lorem" data-testid="search" />);
    expect(screen.getByTestId('search')).toBeDefined();
  });
});
