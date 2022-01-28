import { render, screen, act, fireEvent } from '@testing-library/react';
import { mockApps, mockFilteredApps } from '../../homePage.mocks';
import { AppListCard } from './AppListCard';

const mockSubmit = jest.fn((x) => x);

test('renders AppListCard', () => {
  render(<AppListCard apps={mockApps} />);
  // has first app
  let textEl = screen.getByText(/hello/i);
  expect(textEl).toBeInTheDocument();

  // has second app
  textEl = screen.getByText(/world/i);
  expect(textEl).toBeInTheDocument();
});

test('selected apps in list should be available in onSubmit', () => {
  render(<AppListCard apps={mockApps} filteredApps={mockFilteredApps} onSubmit={mockSubmit} />);
  // has first app
  const label = screen.getByText(/hello/i); // label component
  const input = label.parentNode?.querySelector('input'); // corresponding input component
  expect(label).toBeInTheDocument();
  expect(input).not.toBeNull();
  expect(input?.checked).toBeTruthy();

  act(() => {
    fireEvent.click(input as HTMLInputElement);
  });

  expect(input?.checked).toBeFalsy();

  const submitBtn = screen.getByText(/Apply/i);
  fireEvent.click(submitBtn);

  expect(mockSubmit.mock.calls.length).toBe(1);
  expect(mockSubmit.mock.results[0].value).toEqual({ [mockApps[1].id]: mockApps[1] });
});
