import {
  Button,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Title,
  Text,
  Card,
  CardBody,
  EmptyState,
  EmptyStatePrimary,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  MenuItemAction,
  Switch,
} from '@patternfly/react-core';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { isArray } from 'lodash';
import { ProjectContext } from 'common/context/ProjectContext';
import { HeaderContext } from 'common/context/HeaderContext';
import useHosting from '../hooks/use-hosting';
import DeleteAppModal from '../components/DeleteAppForm';
import { headerLinks } from '../utils';
import styles from '../styles.module.css';
import showAppInDrawer from '../services/show-app-in-drawer';
import authenticateApp from '../services/authenticate-app';

export default function ManageHosting() {
  const { projectId } = useContext(ProjectContext);
  const { setHeader, setHeaderLinks } = useContext(HeaderContext);
  const {
    hosting: { applications },
  } = useHosting();
  const params = useParams<any>();
  const history = useHistory();
  const [processingShowInAppDrawer, setProcessingShowInAppDrawer] =
    useState(false);
  const [processingAuthenticate, setProcessingAuthenticate] = useState(false);

  const app = applications.find((appli) => appli.name === params['spaName']);

  if (!app) {
    history.push('..');
    throw new Error('App not found');
  }

  const hasEnvironments =
    isArray(app.environments) &&
    app.environments.length > 0 &&
    false; /* Disabling the environments temporarily */

  useEffect(() => {
    setHeader([
      { title: 'Hosting', path: `/${projectId}/hosting` },
      {
        title: app.name,
        path: `/${projectId}/hosting/${app.name}`,
      },
    ]);
    setHeaderLinks(headerLinks);
    return () => {
      setHeader([]);
      setHeaderLinks([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.name, projectId]);

  const handleShowInAppDrawerToggle = () => {
    setProcessingShowInAppDrawer(true);
    showAppInDrawer(projectId, !app.showInAppDrawer).then(() => {
      app.showInAppDrawer = !app.showInAppDrawer;
    }).finally(() => {
      setProcessingShowInAppDrawer(false);
    });
  }

  /**
   * Handle request for toggling Auth shield for the App.
   */
  const handleAuthenticateToggle = () => {
    setProcessingAuthenticate(true);
    authenticateApp(projectId, !app.authenticate).then(() => {
      app.authenticate = !app.authenticate;
    }).finally(() => {
      setProcessingAuthenticate(false);
    });
  }

  return (
    <>
      <Stack className="pf-u-mb-xl">
        <StackItem>
          <Flex>
            <FlexItem flex={{ default: 'flex_1' }}>
              <Title headingLevel="h1">{app.name}</Title>
            </FlexItem>
            <FlexItem>
              <Button
                isDisabled
                variant="link"
                className="pf-u-font-weight-bold"
                component={(props) => <Link {...props} to="#" />}
              >
                Deploy Now
                <ion-icon class="pf-u-ml-sm" name="cloud-upload"></ion-icon>
              </Button>
            </FlexItem>
          </Flex>
        </StackItem>
        <StackItem className="pf-u-color-200">
          <Text>
            Path: <strong>{app.path}</strong>
          </Text>
        </StackItem>
      </Stack>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h4" className="pf-u-color-200">
            {app.name} environments
          </Title>
        </StackItem>
        <StackItem className="pf-u-mb-xl">
          <Card isCompact isRounded className={styles['opdc-listblock']}>
            <CardBody>
              <EmptyState>
                <Title headingLevel="h4" className="pf-u-color-300 pf-u-mb-sm">
                  <ion-icon class="pf-u-mr-sm" name="build-outline"></ion-icon>
                  This feature is currently under development.
                </Title>
                <Text className="pf-u-color-200 pf-u-mb-sm">
                  You can still deploy using the SPAship manager.
                </Text>
                <Button
                  variant="secondary"
                  component="a"
                  target="_blank"
                  rel="noreferrer"
                  href="https://spaship.one.redhat.com"
                  icon={<ion-icon name="open-outline"></ion-icon>}
                >
                  Go to SPAship Manager
                </Button>
              </EmptyState>
            </CardBody>
          </Card>
          {!hasEnvironments && false && (
            <Card isRounded className={styles['opdc-listblock']}>
              <CardBody>
                <EmptyState variant="xs">
                  <Text className="pf-u-color-400">
                    <ion-icon class="pf-u-mr-sm" name="cube-outline"></ion-icon>
                    Waiting for your first release
                  </Text>
                  <EmptyStatePrimary>
                    <Button variant="primary">Instructions</Button>
                  </EmptyStatePrimary>
                </EmptyState>
              </CardBody>
            </Card>
          )}
          {hasEnvironments && (
            <Menu className={styles['opdc-listblock']}>
              <MenuContent>
                <MenuList>
                  {app.environments.map((env) => (
                    <MenuItem
                      key={env.name}
                      actions={
                        <Button
                          variant="link"
                          component="a"
                          href={env.url}
                          target="_blank"
                          rel="noreferrer"
                          icon={<ion-icon name="open-outline"></ion-icon>}
                          iconPosition="right"
                        >
                          <strong>{env.ref}</strong>
                        </Button>
                      }
                    >
                      <strong>{env.name}</strong>
                      <small className="pf-u-ml-md pf-u-color-200">
                        last deployment: {env.createdAt}
                      </small>
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuContent>
            </Menu>
          )}
        </StackItem>

        <StackItem>
          <Title headingLevel="h4" className="pf-u-color-200">
            Advanced
          </Title>
        </StackItem>
        <StackItem className="pf-u-mb-md">
          <Card isRounded className={styles['opdc-listblock']}>
            <Menu style={{ boxShadow: 'none' }}>
              <MenuContent>
                <MenuList>
                  <MenuItem
                    itemId={0}
                    actions={
                      <MenuItemAction
                        actionId="show-in-app-drawer"
                        icon={
                          <Switch
                            id="show-in-app-drawer"
                            aria-label="app-drawer"
                            isChecked={app.showInAppDrawer}
                            onChange={handleShowInAppDrawerToggle}
                            isDisabled={processingShowInAppDrawer}
                            isReversed
                            label={processingShowInAppDrawer ? 'Processing...' : undefined}
                          />
                        }
                        aria-label="Show App in App Drawer"
                      />
                    }
                  >
                    Show this App in the Global App Drawer
                  </MenuItem>
                  <MenuItem
                    itemId={1}
                    actions={
                      <MenuItemAction
                        actionId="authenticate"
                        icon={
                          <Switch
                            id="authenticate"
                            aria-label="authenticate"
                            isChecked={app.authenticate}
                            onChange={handleAuthenticateToggle}
                            isDisabled={processingAuthenticate}
                            isReversed
                            label={processingAuthenticate ? 'Processing...' : undefined}
                          />
                        }
                        aria-label="Authenticate App using Red Hat internal SSO"
                      />
                    }
                  >
                    Authenticate this App using Red Hat Internal SSO
                  </MenuItem>
                  <Link to="?action=delete">
                    <MenuItem
                      itemId={2}
                      className="pf-u-danger-color-100 pf-u-font-weight-200"
                      actions={
                        <MenuItemAction
                          actionId="delete"
                          tabIndex={0}
                          icon={
                            <ion-icon
                              class="pf-u-danger-color-100 pf-u-px-sm"
                              name="trash-outline"
                            />
                          }
                          aria-label="Delete this App"
                        />
                      }
                    >
                      Delete this App
                    </MenuItem>
                  </Link>
                </MenuList>
              </MenuContent>
            </Menu>
          </Card>
        </StackItem>
      </Stack>
      <DeleteAppModal spa={app} />
    </>
  );
}
