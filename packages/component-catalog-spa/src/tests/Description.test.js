import React from 'react';
import reactDom from 'react-dom';
import Description from '../Components/Description';
import { render, screen } from '@testing-library/react';

const component = {
  name: 'opc-input-chip',
  path: 'packages/opc-input-chip',
  sha: '796341558bc5597a13f45c24a8ff4a8e8dbbb73c',
  size: 0,
  url: 'https://api.github.com/repos/1-Platform/op-components/contents/packages/opc-input-chip?ref=master',
  html_url: 'https://github.com/1-Platform/op-components/tree/master/packages/opc-input-chip',
  git_url: 'https://api.github.com/repos/1-Platform/op-components/git/trees/796341558bc5597a13f45c24a8ff4a8e8dbbb73c',
  download_url: null,
  type: 'dir',
  _links: {
      self: 'https://api.github.com/repos/1-Platform/op-components/contents/packages/opc-input-chip?ref=master',
      git: 'https://api.github.com/repos/1-Platform/op-components/git/trees/796341558bc5597a13f45c24a8ff4a8e8dbbb73c',
      html: 'https://github.com/1-Platform/op-components/tree/master/packages/opc-input-chip'
  },
  title: 'opc input chip'
};

it('Description renders', () => {
  const div = document.createElement('div');
  reactDom.render(<Description component={component} />, div);
  reactDom.unmountComponentAtNode(div);
});

it(
  'Description renders with text', () => {
    render(<Description component={component} />);
    screen.getByText(/opc input chip/i);
  }
);
