import React from 'react';
import reactDom from 'react-dom';
import Main from '../Components/Main';
import { render, screen } from '@testing-library/react';

it('Description renders', () => {
  const div = document.createElement('div');
  reactDom.render(<Main />, div);
  reactDom.unmountComponentAtNode(div);
});

it(
  'Main renders with text', () => {
    render(<Main />);
    screen.getByText(/Chapeaux/i);
    screen.getByText(/Patternfly Elements/i);
  }
)