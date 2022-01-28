import { render, screen, fireEvent, RenderResult } from '@testing-library/react';
import { mockFeedbacks } from '../../homePage.mocks';
import { FeedbackCard } from './FeedbackCard';

const mockFn = jest.fn();

describe('Feedback Card', () => {
  let component: RenderResult;
  const feedback = mockFeedbacks[0];
  beforeEach(() => {
    component = render(
      <FeedbackCard
        title={feedback.createdBy.cn}
        createdOn={feedback.createdOn}
        description={feedback.summary}
        experience={feedback.experience}
        module={feedback.module}
        category={feedback.category}
        state={feedback.state}
        onClick={mockFn}
      />
    );
  });

  afterEach(() => {
    component.unmount();
  });

  test('Check title is present', () => {
    const textEl = screen.getByText(/lore - 27 January, 2022/i);
    expect(textEl).toBeInTheDocument();
  });

  test('Check popup opens on click', () => {
    const btn = screen.getByText(/view more/i);
    fireEvent.click(btn);
    expect(mockFn.mock.calls.length).toBe(1);
  });
});
