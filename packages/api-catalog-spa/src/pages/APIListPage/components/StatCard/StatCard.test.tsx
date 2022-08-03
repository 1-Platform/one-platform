import { render, screen } from '@testing-library/react';
import { ApiEmailGroup } from 'api/types';
import { StatCard } from './StatCard';

describe('Stat Card', () => {
  test('should render ', () => {
    render(
      <StatCard category="GraphQL">
        <div>lorem</div>
      </StatCard>
    );
    expect(screen.getByText('GraphQL')).toBeDefined();
    expect(screen.getByText('Total:')).toBeDefined();
  });

  test('should show loading ', () => {
    render(
      <StatCard category="GraphQL" isLoading>
        <div>lorem</div>
      </StatCard>
    );
    expect(screen.queryByText('Total:')).toBeNull();
  });
});
