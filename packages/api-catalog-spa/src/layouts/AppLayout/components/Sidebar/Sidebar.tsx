import { useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import opcBase from '@one-platform/opc-base';
import {
  PageSidebar,
  Nav,
  NavList,
  NavItem,
  Split,
  SplitItem,
  NavGroup,
  Title,
  Text,
  TextVariants,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { HomeIcon, CompassIcon, UserIcon } from '@patternfly/react-icons';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import { useRecentVisit } from 'context/RecentVisitContext';
import { config } from 'config';
import styles from './sidebar.module.scss';
import { Footer } from '../Footer';

type NavMenuLinks = {
  url: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentClass<SVGIconProps, any>;
};

export const navMenuLinks = (rhatUUid: string): NavMenuLinks[] => [
  {
    icon: HomeIcon,
    label: 'Home',
    url: '/',
  },
  {
    icon: CompassIcon,
    label: 'Explore',
    url: '/apis',
  },
  {
    icon: UserIcon,
    label: 'My APIs',
    url: `/apis?mid=${rhatUUid}`,
  },
];

export const restQuickLinks = [
  {
    img: 'info-circle.svg',
    label: 'API Description',
    url: `/apis/:id`,
  },
  {
    img: 'swagger-logo.svg',
    label: 'Swagger',
    url: `/apis/rest/swagger/:envSlug`,
  },
  {
    img: 'redoc-logo.png',
    label: 'Redoc',
    url: `/apis/rest/redoc/:envSlug`,
  },
];

export const graphqlQuickLinks = [
  {
    img: 'info-circle.svg',
    label: 'API Description',
    url: `/apis/:id`,
  },
  {
    img: 'gql-playground-logo.svg',
    label: 'Playground',
    url: `/apis/graphql/playground/:envSlug`,
  },
];

type Props = {
  isOpen?: boolean;
};

export const Sidebar = ({ isOpen }: Props): JSX.Element => {
  const { pathname, search } = useLocation();
  const url = pathname.replace(config.baseURL, '');
  const { logs, quickLink } = useRecentVisit();
  const userInfo = opcBase.auth?.getUserInfo();
  const navLinks = useMemo(() => navMenuLinks(userInfo?.rhatUUID || ''), [userInfo?.rhatUUID]);

  const getToolImage = useCallback((tool: string) => {
    if (tool === 'playground') return `${config.baseURL}/images/gql-playground-logo.svg`;
    if (tool === 'redoc') return `${config.baseURL}/images/redoc-logo.png`;
    return `${config.baseURL}/images/${tool}-logo.svg`;
  }, []);

  const isQuickLinkActive = logs?.[0]?.url === pathname;
  const isQuickLinkGraphql = logs?.[0]?.tool !== 'swagger' && logs?.[0]?.tool !== 'redoc';

  const getQuickLinks = useCallback(() => {
    if (isQuickLinkActive) {
      const links = isQuickLinkGraphql ? graphqlQuickLinks : restQuickLinks;
      return (
        <NavGroup title={`${quickLink?.name} quick links`}>
          {links.map(({ url: path, label, img }) => (
            <NavItem key={`quick-link-${label}`}>
              <Link
                to={path
                  .replace(':id', quickLink?.id || '')
                  .replace(':envSlug', quickLink?.envSlug || '')}
              >
                <Split>
                  <SplitItem className="pf-u-mr-sm pf-u-display-flex pf-u-align-items-center">
                    <img
                      src={`${config.baseURL}/images/${img}`}
                      width="16px"
                      alt="quick link icon"
                    />
                  </SplitItem>
                  <SplitItem>{label}</SplitItem>
                </Split>
              </Link>
            </NavItem>
          ))}
        </NavGroup>
      );
    }
    return null;
  }, [isQuickLinkActive, isQuickLinkGraphql, quickLink?.id, quickLink?.name, quickLink?.envSlug]);

  return (
    <PageSidebar
      theme="light"
      isNavOpen={isOpen}
      className={styles['app-layout--sidebar']}
      nav={
        <Stack hasGutter>
          <StackItem isFilled>
            <Nav theme="light">
              <NavList className="pf-u-mb-lg">
                {navLinks.map(({ url: pattern, label, icon: Icon }, index) => (
                  <NavItem
                    key={`nav-menu-link:${label}`}
                    id="home-link"
                    itemId={index}
                    isActive={pattern === url + search}
                  >
                    <Link to={pattern}>
                      <Split>
                        <SplitItem className="pf-u-mr-sm">
                          <Icon />
                        </SplitItem>
                        <SplitItem>{label}</SplitItem>
                      </Split>
                    </Link>
                  </NavItem>
                ))}
              </NavList>
              {getQuickLinks()}
              <NavGroup title="Recent visited">
                {logs?.map(({ title, url: toolUrl, tool }) => (
                  <NavItem key={`nav-item-${toolUrl}`}>
                    <Link to={toolUrl.replace(config.baseURL, '/')}>
                      <Split hasGutter className="pf-u-align-items-center">
                        <SplitItem>
                          <img src={getToolImage(tool)} style={{ height: '24px' }} alt="swagger" />
                        </SplitItem>
                        <SplitItem>
                          <Title headingLevel="h6">{title}</Title>
                          <Text component={TextVariants.small} className="capitalize">
                            {tool}
                          </Text>
                        </SplitItem>
                      </Split>
                    </Link>
                  </NavItem>
                ))}
              </NavGroup>
            </Nav>
          </StackItem>
          <StackItem>
            <Footer />
          </StackItem>
        </Stack>
      }
    />
  );
};
