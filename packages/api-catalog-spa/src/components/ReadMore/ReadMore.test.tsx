import { render, screen } from '@testing-library/react';
import { ReadMore } from './ReadMore';

describe('Readmore Button', () => {
  test('When text is under a limit', () => {
    render(<ReadMore>Hello world</ReadMore>);
    expect(screen.queryByText(/...Read more/i)).toBeNull();
    expect(screen.queryByText(/Show less/i)).toBeNull();
  });
});
