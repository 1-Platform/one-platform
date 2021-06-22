import { Card, CardBody, DropdownItem, Flex, FlexItem, Grid, GridItem, Stack, StackItem, Text, Title } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import useMyAppsAPI from '../hooks/useMyAppsAPI';
import AppCard from './AppCard';
import Loader from './Loader';
import './AppIndex.css'

function AppIndex () {
  const { apps, loading } = useMyAppsAPI();

  const cardDropdownItems = (appId: string) => [
    <DropdownItem key='edit' href={ process.env.PUBLIC_URL + '/' + appId + '/settings' }>Edit App</DropdownItem>,
    <DropdownItem key='delete' className="pf-u-danger-color-100" href={ process.env.PUBLIC_URL + '/' + appId + '/settings?action=delete' }>Delete App</DropdownItem>,
  ];

  function NewAppButton () {
    return <Link to="/?new=true">
      <Card isPlain isRounded isFullHeight className="new-app--card">
        <CardBody>
          <Flex
            style={ { height: '100%' } }
            alignItems={ { default: 'alignItemsCenter' } }
            direction={ { default: 'column' } }
            justifyContent={ { default: 'justifyContentCenter' } }>
            <FlexItem spacer={ { default: 'spacerNone' } }>
              <ion-icon name="add-outline" size="large"></ion-icon>
            </FlexItem>
            <FlexItem>
              <Text>Create new App</Text>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </Link>;
  }

  return (
    <>
      <main className="container">
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h1" className="pf-u-text-align-center">My Projects</Title>
          </StackItem>
          { loading
            ? <Loader />
            : <StackItem isFilled>
              <Grid hasGutter span={ 4 }>
                <GridItem><NewAppButton/></GridItem>
                { apps.map( app =>
                  <GridItem key={app.id}>
                    <AppCard
                      app={app}
                      dropdownItems={ cardDropdownItems(app.appId) } />
                  </GridItem>
                ) }
              </Grid>
            </StackItem>
          }
        </Stack>
      </main>
    </>
  )
}

export default AppIndex;
