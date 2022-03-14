import React from 'react';
import reactDom from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { render, screen } from '@testing-library/react';

const components = [
  {
    'op-components': [
      {
        'name': 'opc-back-to-top',
        'path': 'packages/opc-back-to-top',
        'sha': 'ae1e20b1f74fa84291a5e2f109f61ea547a2e379',
        'size': 0,
        'url': 'https://api.github.com/repos/1-Platform/op-components/contents/packages/opc-back-to-top?ref=master',
        'html_url': 'https://github.com/1-Platform/op-components/tree/master/packages/opc-back-to-top',
        'git_url': 'https://api.github.com/repos/1-Platform/op-components/git/trees/ae1e20b1f74fa84291a5e2f109f61ea547a2e379',
        'download_url': null,
        'type': 'dir',
        '_links': {
          'self': 'https://api.github.com/repos/1-Platform/op-components/contents/packages/opc-back-to-top?ref=master',
          'git': 'https://api.github.com/repos/1-Platform/op-components/git/trees/ae1e20b1f74fa84291a5e2f109f61ea547a2e379',
          'html': 'https://github.com/1-Platform/op-components/tree/master/packages/opc-back-to-top'
            },
        'title': 'opc back to top'
        },
      ]
  },
  {
    'patternfly-elements': [
        {
          'name': 'pfe-accordion',
          'path': 'elements/pfe-accordion',
          'sha': '5e65d0a87905b1d328781887dd99331483a67707',
          'size': 0,
          'url': 'https://api.github.com/repos/patternfly/patternfly-elements/contents/elements/pfe-accordion?ref=main',
          'html_url': 'https://github.com/patternfly/patternfly-elements/tree/main/elements/pfe-accordion',
          'git_url': 'https://api.github.com/repos/patternfly/patternfly-elements/git/trees/5e65d0a87905b1d328781887dd99331483a67707',
          'download_url': null,
          'type': 'dir',
          '_links': {
              'self': 'https://api.github.com/repos/patternfly/patternfly-elements/contents/elements/pfe-accordion?ref=main',
              'git': 'https://api.github.com/repos/patternfly/patternfly-elements/git/trees/5e65d0a87905b1d328781887dd99331483a67707',
              'html': 'https://github.com/patternfly/patternfly-elements/tree/main/elements/pfe-accordion'
          },
          'title': 'pfe accordion'
        },
      ]
  },
  {
    'cpx-components': [
      {
        'name': 'cpx-auth',
        'path': 'components/cpx-auth',
        'sha': '1a731cb31ab8c6dca2287dd59671b67a323c9424',
        'size': 0,
        'url': 'https://api.github.com/repos/chapeaux/cpx-components/contents/components/cpx-auth?ref=main',
        'html_url': 'https://github.com/chapeaux/cpx-components/tree/main/components/cpx-auth',
        'git_url': 'https://api.github.com/repos/chapeaux/cpx-components/git/trees/1a731cb31ab8c6dca2287dd59671b67a323c9424',
        'download_url': null,
        'type': 'dir',
        '_links': {
            'self': 'https://api.github.com/repos/chapeaux/cpx-components/contents/components/cpx-auth?ref=main',
            'git': 'https://api.github.com/repos/chapeaux/cpx-components/git/trees/1a731cb31ab8c6dca2287dd59671b67a323c9424',
            'html': 'https://github.com/chapeaux/cpx-components/tree/main/components/cpx-auth'
        },
        'title': 'cpx auth'
      },
    ]
  }
];

it('Navbar renders', () => {
  const div = document.createElement('div');
  reactDom.render(<MemoryRouter><Navbar components={components} /> </MemoryRouter>, div);
  reactDom.unmountComponentAtNode(div);
});

it(
  'Navbar renders with text', () => {
    render(<MemoryRouter><Navbar components={components} /> </MemoryRouter>);
    screen.getByText(/op components/i);
    screen.getByText(/patternfly elements/i);
    screen.getByText(/cpx components/i);
  }
);
