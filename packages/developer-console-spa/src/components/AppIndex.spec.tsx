import { render } from '@testing-library/react';
import AppIndex from './AppIndex';

it( 'should render the heading', () => {
  const { getByText } = render(<AppIndex />);
  const headingElement = getByText( /app index/i );
  expect( headingElement ).toBeInTheDocument();
} );
