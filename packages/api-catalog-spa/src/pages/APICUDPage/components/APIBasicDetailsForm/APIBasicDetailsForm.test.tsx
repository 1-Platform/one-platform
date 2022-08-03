import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { APIBasicDetailsForm, Props } from './APIBasicDetailsForm';

type TestProps = {
  onSubmit: () => void;
} & Props;

const TestComponent = ({ onSubmit, ...props }: TestProps) => {
  const formState = useForm();

  return (
    <form onSubmit={formState.handleSubmit(onSubmit)}>
      <FormProvider {...formState}>
        <APIBasicDetailsForm {...props} />
      </FormProvider>
    </form>
  );
};

describe('APIBasicDetails component', () => {
  test('should render', () => {
    const submitMockFn = jest.fn();
    const onSearchOwnerMock = jest.fn();
    const outageComponents = [{ id: 'lorem', name: 'ipsum', status: 'selected' }];

    render(
      <TestComponent
        onSubmit={submitMockFn}
        onSearchOwners={onSearchOwnerMock}
        outageComponents={outageComponents}
      />
    );
  });
});
