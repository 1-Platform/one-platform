import { Button, Card, CardBody, Flex, FlexItem, Grid, GridItem, Menu, MenuItem, MenuItemAction, Switch, Text, Title } from '@patternfly/react-core';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Loader from './Loader';
import './AppOverview.css';
import { useHistory } from 'react-router-dom';

function AppOverview () {
  const { app, loading } = useContext( AppContext );
  const history = useHistory();

  const [services] = useState([
    { id: 'ssi', name: 'SSI Header', path: 'ssi', isActive: false, disabled: true },
    { id: 'database', name: 'Database', path: 'database', isActive: false, disabled: true },
    { id: 'feedback', name: 'Feedback', path: 'feedback', isActive: false, disabled: true },
    { id: 'search', name: 'Search', path: 'search', isActive: false, disabled: true },
    { id: 'notifications', name: 'Notifications', path: 'notifications', isActive: false, disabled: true },
  ] );

  if ( loading ) {
    return <Loader />;
  }

  return (
    <>
      <Grid hasGutter>
        <GridItem span={ 12 }>
          <Card isRounded className="pf-u-box-shadow-md">
            <CardBody>
              <Flex direction={ { default: 'row' } }>
                <FlexItem flex={ { default: 'flex_1' } }>
                  <Title headingLevel="h1" className="pf-u-mb-sm">{ loading ? 'Loading...' : app.name }</Title>
                  <Flex direction={ { default: 'row' } }>
                    {/* <FlexItem>
                      <Text>Owner: <strong>{ app.owner }</strong></Text>
                    </FlexItem> */}
                    <FlexItem>
                      <Text>Path: <strong>{ app.path }</strong></Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem flex={ { default: 'flexNone' } } alignSelf={ { default: 'alignSelfCenter' } }>
                  <a href={ app.path } target="_blank" rel="noreferrer">View App
                &nbsp;<ion-icon name="open-outline"></ion-icon></a>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={ 8 }>
          <Title headingLevel="h3" className="pf-u-my-sm">One Platform Services:</Title>
          <Card isRounded>
            <Menu className="app-service--list-item">
              { services.map( service => (
                <MenuItem
                  className="pf-u-align-items-center"
                  key={ service.id }
                  // to={ app.path + '/' + service.path }
                  onClick={ () => history.push( app.path + '/' + service.path)}
                  isSelected={false}
                  actions={
                    <MenuItemAction
                    icon={ <Switch
                      isDisabled={true}
                      id={ 'switch-' + service.id }
                      aria-label={ service.name }
                      isChecked={ service.isActive }
                      onChange={ () => { } }/>}
                    /> }>
                  { service.name }
                  </MenuItem>
              ))}
            </Menu>
          </Card>
        </GridItem>
        <GridItem span={4}>
          <Card isRounded>
            <CardBody>
              <Title headingLevel="h5" className="pf-u-mb-sm">SPAship Manager</Title>
              <Text className="pf-u-mb-sm">Manage your SPA deployments from SPAship manager:</Text>
              <Button component="a" variant="secondary" target="_blank" href={ 'https://spaship.one.redhat.com/applications' + app.path + '/details' }>View my SPA&nbsp;<ion-icon name="open-outline"></ion-icon></Button>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}

export default AppOverview;
