import { render, screen, fireEvent, RenderResult } from '@testing-library/react';
import { FilterTitle } from './FilterTitle';

const mockFn = jest.fn();

describe('Filter Title', () => {
  let component: RenderResult;
  beforeEach(() => {
    component = render(<FilterTitle title="Applications" onClear={mockFn} isClearable />);
  });

  afterEach(() => {
    component.unmount();
  });

  test('Should have a title', () => {
    const textEl = screen.getByText(/Applications/i);
    expect(textEl).toBeInTheDocument();
  });

  test('Should fire onClear event on clear button click', () => {
    const btn = screen.getByText(/clear/i);
    fireEvent.click(btn);
    expect(mockFn.mock.calls.length).toBe(1);
  });
});
