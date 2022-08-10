import { render, screen } from '@testing-library/react';
import { ApiEmailGroup } from 'api/types';
import { ApiOwnersCard } from './ApiOwnersCard';

describe('API Owner Card', () => {
  test('should render mailing list', () => {
    render(
      <ApiOwnersCard owners={[{ email: 'lorem@ipsum.com', group: ApiEmailGroup.MAILING_LIST }]} />
    );
    expect(screen.getByText('lorem@ipsum.com')).toBeDefined();
    expect(screen.getByText('Mailing list')).toBeDefined();
  });

  test('should render user', () => {
    render(
      <ApiOwnersCard
        owners={[
          { group: ApiEmailGroup.USER, user: { cn: 'lorem', rhatJobTitle: 'ipsum' } as any },
        ]}
      />
    );
    expect(screen.getByText('lorem')).toBeDefined();
    expect(screen.getByText('ipsum')).toBeDefined();
  });
});
