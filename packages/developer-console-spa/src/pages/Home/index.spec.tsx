import { render } from '@testing-library/react';
import AppIndex from 'pages/Home';

it( 'should render the heading', () => {
  const { getByText } = render(<AppIndex />);
  // eslint-disable-next-line testing-library/prefer-screen-queries
  const headingElement = getByText( /app index/i );
  expect( headingElement ).toBeInTheDocument();
} );
