import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';

test('renders Loader', () => {
  render(<Loader />);
  const linkElement = screen.getByText(/Loading.../i);
  expect(linkElement).toBeDefined();
});
