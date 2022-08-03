import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer tests', () => {
  test('should render footer', () => {
    render(<Footer />);
    expect(screen.getByText(/Docs/i)).toBeDefined();
    expect(screen.getByText(/Blogs/i)).toBeDefined();
    expect(screen.getByText(/Contact Us/i)).toBeDefined();
  });
});
