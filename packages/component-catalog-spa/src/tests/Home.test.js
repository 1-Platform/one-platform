import React from 'react';
import reactDom from 'react-dom';
import Home from '../Pages/Home';
import { render, screen } from '@testing-library/react';

it('Home renders', () => {
  const div = document.createElement('div');
  reactDom.render(<Home />, div);
  reactDom.unmountComponentAtNode(div);
});

it('Home renders with text', () => {
  render(<Home />);
  screen.getByText(/Components Catalog/i);
  screen.getByText(/A Unified interface/i);
});
