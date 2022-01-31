import { render, screen } from '@testing-library/react';
import { mockFeedbacks } from 'pages/HomePage/homePage.mocks';
import { FeedbackDetailCard } from './FeedbackDetailCard';

describe('Feedback Detail PopUp', () => {
  test('Should have a title', () => {
    render(<FeedbackDetailCard feedback={mockFeedbacks[0] as any} />);
    const title = screen.getByText(/lore at 27 January 2022/i);
    expect(title).toBeInTheDocument();
  });

  test('Should have loading screen', () => {
    render(<FeedbackDetailCard feedback={mockFeedbacks[0] as any} isLoading />);
    const loadingScreen = screen.getByText(/Loading/i);
    expect(loadingScreen).toBeInTheDocument();
  });

  test('Should have not found screen', () => {
    render(<FeedbackDetailCard />);
    const emptyMsg = screen.getByText(/No feedback found!!!/i);
    expect(emptyMsg).toBeInTheDocument();
  });
});
