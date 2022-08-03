import { render, screen } from '@testing-library/react';
import { Description } from './Description';

describe('Description test', () => {
  test('should show formated desc', () => {
    render(
      <Description title="dolor">
        <div>lorem ipsum</div>
      </Description>
    );

    expect(screen.getByText(/dolor/)).toBeDefined();
  });

  test('should have a * for isRequired desc', () => {
    render(
      <Description title="dolor" isRequired>
        <div>lorem ipsum</div>
      </Description>
    );

    expect(screen.getByText('*')).toBeDefined();
  });
});
