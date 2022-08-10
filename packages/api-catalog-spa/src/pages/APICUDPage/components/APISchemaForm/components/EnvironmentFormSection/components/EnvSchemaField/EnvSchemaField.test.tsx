import { render, screen } from '@testing-library/react';
import { EnvSchemaField } from './EnvSchemaField';

describe('Env Schema Field Test', () => {
  test('should render', () => {
    render(<EnvSchemaField envIndex={0} onCopyValue={jest.fn()} onRedoValidation={jest.fn()} />);
  });

  test('should show error message', () => {
    render(
      <EnvSchemaField
        envIndex={0}
        onCopyValue={jest.fn()}
        onRedoValidation={jest.fn()}
        isError
        errorMessage="failed"
      />
    );

    expect(screen.getByText('failed')).toBeDefined();
  });
});
