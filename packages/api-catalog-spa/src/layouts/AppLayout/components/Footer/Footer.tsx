import { Split, SplitItem, Stack, StackItem, Text, TextVariants } from '@patternfly/react-core';

const footerLinks = [
  {
    href: '/get-started/docs',
    title: 'Docs',
  },
  {
    href: '/get-started/blog',
    title: 'Blogs',
  },
  {
    href: '/contact-us',
    title: 'Contact us',
  },
];

export const Footer = (): JSX.Element => {
  return (
    <Stack hasGutter className="pf-u-p-lg">
      <StackItem>
        <Text component={TextVariants.h2}>About One Platform</Text>
      </StackItem>
      <StackItem>
        <Split hasGutter>
          {footerLinks.map(({ href, title }) => (
            <SplitItem key={`footer-link-${href}`}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-current="page"
                className="catalog-nav-link"
              >
                {title}
              </a>
            </SplitItem>
          ))}
        </Split>
      </StackItem>
      <StackItem>
        <Text component={TextVariants.small} className="pf-u-color-200">
          © 2021 RedHat Inc.
        </Text>
      </StackItem>
    </Stack>
  );
};
