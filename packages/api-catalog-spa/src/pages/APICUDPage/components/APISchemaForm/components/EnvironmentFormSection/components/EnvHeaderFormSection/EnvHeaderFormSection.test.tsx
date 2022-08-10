import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { EnvHeaderFormSection } from './EnvHeaderFormSection';

const TestComponent = () => {
  const formState = useForm();

  return (
    <form onSubmit={formState.handleSubmit(jest.fn())}>
      <FormProvider {...formState}>
        <EnvHeaderFormSection envPos={0} schemaPos={0} />
      </FormProvider>
    </form>
  );
};

describe('APIBasicDetails component', () => {
  test('should render', () => {
    render(<TestComponent />);
  });
});
