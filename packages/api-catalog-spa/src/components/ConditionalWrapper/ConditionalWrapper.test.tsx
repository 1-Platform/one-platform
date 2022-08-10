import { render, screen } from '@testing-library/react';
import { ConditionalWrapper } from './ConditionalWrapper';

describe('Big catalog button test', () => {
  test('Should show wrapper component', () => {
    render(
      <ConditionalWrapper isWrapped wrapper={(child) => <div>hello world {child}</div>}>
        <div>child</div>
      </ConditionalWrapper>
    );

    expect(screen.getByText(/hello world/i)).toBeDefined();
  });

  test('Should not show wrapper component', () => {
    render(
      <ConditionalWrapper
        isWrapped={false}
        wrapper={(child) => (
          <div>
            hello world <div>{child}</div>
          </div>
        )}
      >
        <div>child</div>
      </ConditionalWrapper>
    );

    expect(screen.queryByText(/hello world/i)).toBeNull();
  });
});
