import { render, screen } from '@testing-library/react';
import { ApiEmailGroup } from 'api/types';
import { Header } from './Header';

describe('API Owner Card', () => {
  test('should render', () => {
    render(<Header />);
    expect(screen.getByText('API Catalog')).toBeDefined();
    expect(
      screen.getByText(
        'A catalog of APIs to manage, promote and share APIs with developers and users.'
      )
    ).toBeDefined();
  });
});
