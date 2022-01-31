import { render, screen } from '@testing-library/react';
import { useQueryParams } from './useQueryParams';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    search: '?hello=world',
  }),
}));

const UseQueryParamsTest = () => {
  const query = useQueryParams();
  return <div>{query.get('hello')}</div>;
};

test('loads the query params value', () => {
  render(<UseQueryParamsTest />);
  const textEl = screen.getByText(/world/i);
  expect(textEl).toBeInTheDocument();
});
