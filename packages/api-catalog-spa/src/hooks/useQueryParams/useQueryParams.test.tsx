import { render, screen } from '@testing-library/react';
import { useQueryParams } from './useQueryParams';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?hello=world',
  }),
}));

const UseQueryParamsTest = () => {
  const query = useQueryParams();

  return <div>{query.get('hello')}</div>;
};

describe('UseQueryParamsTest tests', () => {
  test('should get query', () => {
    render(<UseQueryParamsTest />);
    expect(screen.getByText(/world/i)).toBeDefined();
  });
});
