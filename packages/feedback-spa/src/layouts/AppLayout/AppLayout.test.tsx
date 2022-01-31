import { render, screen } from '@testing-library/react';
import { AppLayout } from './AppLayout';

describe('App Layout Component', () => {
  test('renders layout component', () => {
    render(<AppLayout />);
    const textEl = screen.getAllByText(/Feedback/i);
    expect(textEl[0]).toBeInTheDocument();
  });

  test('should have breadcrumb link to home', () => {
    render(<AppLayout />);
    const anchor = screen.getByText(/One Platform/i) as HTMLAnchorElement;
    const url = new URL(anchor.href);
    expect(url.pathname).toEqual('/');
  });

  test('should have active breadcrumb ', () => {
    render(<AppLayout />);
    const anchor = screen.getByText(/All Feedback/i) as HTMLAnchorElement;
    expect(anchor).toBeInTheDocument();
  });
});
