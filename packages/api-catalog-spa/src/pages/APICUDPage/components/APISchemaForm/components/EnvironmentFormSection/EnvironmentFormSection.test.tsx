import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { EnvironmentFormSection } from './EnvironmentFormSection';

const TestComponent = () => {
  const formState = useForm();

  return (
    <form onSubmit={formState.handleSubmit(jest.fn())}>
      <FormProvider {...formState}>
        <EnvironmentFormSection schemaPos={1} handleSchemaValidation={jest.fn()} />
      </FormProvider>
    </form>
  );
};

describe('EnvironmentFormSection component', () => {
  test('should render', () => {
    render(<TestComponent />);
  });
});
