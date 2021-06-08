import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

it('renders the app', () => {
  const component = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(component).toBeTruthy();
});
