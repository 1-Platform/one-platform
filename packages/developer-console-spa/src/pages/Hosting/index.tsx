import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from 'common/context/ProjectContext';
import { HeaderContext } from 'common/context/HeaderContext';
import { Card, CardBody, EmptyState, Title, EmptyStateBody, Button, Flex, FlexItem, EmptyStatePrimary, Grid, GridItem, Bullseye } from '@patternfly/react-core';
import useHosting from './hooks/use-hosting';
import ApplicationCard from './components/ApplicationCard';
import NewAppForm from './components/NewAppForm';
import { headerLinks } from './utils';
import styles from './styles.module.css';

export default function ConfigureHosting() {
  const { projectId } = useContext(ProjectContext);
  const { setHeader, setHeaderLinks } = useContext(HeaderContext);
  const { hosting } = useHosting();

  useEffect(() => {
    if (hosting?.applications?.length === 0) {
      setHeader([]);
    } else {
      setHeader([
        { title: 'Hosting', path: `/${projectId}/hosting` },
      ]);
    }
    setHeaderLinks(headerLinks);
    return () => {
      setHeader([]);
      setHeaderLinks([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, hosting]);

  if (!hosting?.applications?.length) {
    return (
      <Card isRounded>
        <CardBody>
          <EmptyState variant="small">
            <Title headingLevel="h1">Hosting</Title>
            <EmptyStateBody>
              Deploy Single Page Applications quickly and easily using SPAship
              CLI.
            </EmptyStateBody>
            <EmptyStatePrimary>
              <Flex justifyContent={{ default: 'justifyContentCenter' }}>
                <FlexItem>
                  <Button variant="primary">Get Started</Button>
                </FlexItem>
                <FlexItem>
                  <Button variant="plain">Learn More</Button>
                </FlexItem>
              </Flex>
            </EmptyStatePrimary>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Grid hasGutter xl2={4} sm={6}>
        <GridItem>
          {hosting.applications.map((application: any) => (
            <ApplicationCard key={application.name} application={application} />
          ))}
        </GridItem>
        <GridItem>
          <Link to="?action=new">
            <Card isFlat isRounded className={styles['opdc-card-newApp']}>
              <Bullseye style={{ height: '100%' }}>
                <div className="pf-u-text-align-center">
                  <ion-icon name="add-outline" size="large"></ion-icon>
                  <Title headingLevel="h5">Add App</Title>
                </div>
              </Bullseye>
            </Card>
          </Link>
        </GridItem>
      </Grid>
      <NewAppForm />
    </>
  );
}
