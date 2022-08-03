import { render, screen } from '@testing-library/react';
import { CatalogBigButton } from './CatalogBigButton';

describe('Big catalog button test', () => {
  beforeEach(() => {
    render(<CatalogBigButton image="https://placeholder.com" title="title" desc="description" />);
  });

  test('Should show title', () => {
    expect(screen.getByText(/title/i)).toBeDefined();
  });

  test('Should show description', () => {
    expect(screen.getByText(/description/i)).toBeDefined();
  });
});
