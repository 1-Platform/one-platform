import { Card, CardHeader, Nav, NavItem, NavList, Title } from '@patternfly/react-core';
import { useCallback, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ProjectContext } from 'common/context/ProjectContext';
import './styles.css';

function Sidebar () {
  const { projectId } = useContext( ProjectContext );

  const location = useLocation();

  const integrations = [
    { name: 'OP Navbar', path: 'op-navbar', },
    { name: 'Hosting', path: 'hosting', },
    { name: 'Database', path: 'database', },
    { name: 'Feedback', path: 'feedback', },
    { name: 'Search', path: 'search', },
    { name: 'Notifications', path: 'notifications' },
    { name: 'Lighthouse', path: 'lighthouse' },
  ];

  const isNavItemActive = useCallback( ( path: string ) => {
    return location.pathname.startsWith( `/${ projectId }/${ path }` );
  }, [projectId, location.pathname] );

  return (
    <>
      <Nav
        theme="light"
        className="app-details--sidebar pf-u-box-shadow-md-right"
      >
        <Link to="/">
          <Card isCompact isPlain style={{ backgroundColor: '#ddefff' }}>
            <CardHeader>
              <Title headingLevel="h4" className='pf-u-color-100'>
                <ion-icon
                  style={{
                    marginRight: '.5rem',
                    fontSize: '1.5rem',
                    marginBottom: '-4%',
                  }}
                  name="code-slash-outline"
                ></ion-icon>
                Developer Console
              </Title>
            </CardHeader>
          </Card>
        </Link>

        <NavList className="app-details--sidebar--main-nav">
          <NavItem isActive={isNavItemActive('overview')}>
            <Link to={`/${projectId}/overview`}>Overview</Link>
          </NavItem>
          <NavItem isActive={isNavItemActive('analytics')}>
            <Link to={`/${projectId}/analytics`}>Analytics</Link>
          </NavItem>

          <Title
            headingLevel="h4"
            className="app-details--sidebar--title pf-u-color-400 pf-u-px-md"
          >
            Integrations
          </Title>

          {integrations.map(({ name, path }, index) => (
            <NavItem key={index} isActive={isNavItemActive(path)}>
              <Link to={`/${projectId}/${path}`}>{name}</Link>
            </NavItem>
          ))}
        </NavList>
        <NavList className="app-details--sidebar--settings pf-u-mt-auto">
          <NavItem isActive={isNavItemActive('settings')}>
            <Link to={`/${projectId}/settings`}>
              App Settings
              <ion-icon
                class="pf-u-ml-auto pf-u-my-auto"
                name="settings-outline"
              ></ion-icon>
            </Link>
          </NavItem>
        </NavList>
      </Nav>
    </>
  );
}

export default Sidebar;
