import op from '../assets/images/op-logo.svg';
import pfe from '../assets/images/pfe-logo.svg';
import cpx from '../assets/images/chapeaux-logo.svg';
import pf from '../assets/images/patternfly-logo.svg';
import dp from '../assets/images/druplicon-vector.svg';

export const Libraries = [
  {
    id: 1,
    shortName: 'cpx',
    title: 'Chapeaux',
    logo: cpx,
    description: 'A relatively unopinionated toolset built around enterprise-grade, functional, web components.',
    link: 'https://github.com/chapeaux',
    email: 'ldary@redhat.com',
  },
  {
    id: 2,
    shortName: 'pfe',
    title: 'Patternfly Elements',
    logo: pfe,
    description: 'A set of community-created web components based on PatternFly design.',
    link: 'https://github.com/patternfly/patternfly-elements',
    email: 'patternfly-elements-contribute@redhat.com',
  },
  {
    id: 3,
    shortName: 'opc',
    title: 'One Platform Components',
    logo: op,
    description: 'One platform component library is a collection of web components which are built using lit-element, each component follows the red hat brand guideline.',
    link: 'https://github.com/1-platform/op-components',
    email: 'one-portal-devel@redhat.com',
  },
  {
    id: 4,
    shortName: 'pf',
    title: 'PatternFly React Components',
    logo: pf,
    description: 'PatternFly is an open source design system created to enable consistency and usability across a wide range of applications and use cases.',
    link: 'https://github.com/patternfly/patternfly-react',
    email: 'patternfly@redhat.com',
  },
  {
    id: 5,
    shortName: 'pf-react',
    title: 'Patternkit',
    logo: dp,
    description: 'Drupal plugin that allows you to drag and drop a library of patterns / web components.',
    link: 'https://gitlab.corp.redhat.com/uxdd/webrh',
    email: '',
  }
];
