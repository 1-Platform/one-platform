import {
  Button,
  Card,
  CardBody,
  DropdownItem,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Split,
  Stack,
  StackItem,
  Text,
  Title,
} from '@patternfly/react-core';
import { ReactComponent as HeroBg } from 'assets/hero-bg.svg';
import Loader from 'common/components/Loader';
import ProjectCard from 'common/components/ProjectCard';
import UnderDevelopment from 'common/components/UnderDevelopment';
import { useDynamicScrollSpy } from 'common/hooks/useDynamicScrollSpy';
import useMyProjectsAPI from 'common/hooks/useMyProjectsAPI';
import config from 'config';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import offerings from './app-services.json';
import './styles.css';

function AppIndex() {
  const { projects, loading } = useMyProjectsAPI();
  const [activeProjectsTab, setActiveProjectsTab] = useState(0);
  const [activeServicesTabKey, setActiveServicesTabKey] = useState(
    offerings[0].label.toLowerCase()
  );

  const [activeEntry] = useDynamicScrollSpy({
    containerClass: '.opdc-main--offerings__section',
    options: {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    },
  });

  useEffect(() => {
    if (activeEntry) {
      setActiveServicesTabKey(activeEntry.target.id);
    }
  }, [activeEntry]);

  const handleProjectsTab = useCallback((tabIndex: number) => {
    setActiveProjectsTab(tabIndex);
  }, []);

  const handleServicesTab = useCallback((tabKey: string) => {
    setActiveServicesTabKey(tabKey);
  }, []);

  const cardDropdownItems = useCallback(
    (appId: string) => [
      <DropdownItem
        key="edit"
        href={process.env.PUBLIC_URL + '/' + appId + '/settings'}
      >
        Edit App
      </DropdownItem>,
      <DropdownItem
        key="delete"
        className="pf-u-danger-color-100"
        href={process.env.PUBLIC_URL + '/' + appId + '/settings?action=delete'}
      >
        Delete App
      </DropdownItem>,
    ],
    []
  );

  const generateProjectCards = useCallback(
    (filteredProjects: Project[]) =>
      filteredProjects
        .map((project) => (
          <GridItem key={project.id}>
            <ProjectCard
              project={project}
              dropdownItems={cardDropdownItems(project.projectId)}
            />
          </GridItem>
        ))
        .reverse(),
    [cardDropdownItems]
  );

  const filteredProjectCards = useMemo(() => {
    if (activeProjectsTab === 0) {
      return generateProjectCards(projects);
    }
    return (
      <GridItem span={12}>
        <UnderDevelopment />
      </GridItem>
    );
  }, [activeProjectsTab, projects, generateProjectCards]);

  return (
    <>
      <main className="home">
        <Stack hasGutter className="container">
          <StackItem>
            <Grid hasGutter className="opdc-main--hero">
              <GridItem
                md={8}
                order={{ default: '2', md: '1' }}
                className="opdc-main--hero__content"
              >
                <Title headingLevel="h1" className="pf-u-mb-md">
                  Develop and Deploy on One Platform
                </Title>
                <Text className="pf-u-mb-md">
                  Create and manage your projects while using any of the One
                  Platform services to help build your applications quickly and
                  easily.
                </Text>
                <Split hasGutter>
                  <Link to="/?new=true">
                    <Button variant="primary">Get Started</Button>
                  </Link>
                  <Button
                    variant="link"
                    component="a"
                    href="/get-started/docs/console"
                    target="_blank"
                  >
                    Learn More
                  </Button>
                </Split>
              </GridItem>
              <GridItem
                md={4}
                order={{ default: '1', md: '2' }}
                className="opdc-main--hero__bg"
              >
                <HeroBg />
              </GridItem>
            </Grid>
          </StackItem>
          <StackItem>
            <Card isRounded>
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={2}>
                    <ul className="opdc-main--project__tabs">
                      <li
                        className="opdc-main--project__tab"
                        data-active={activeProjectsTab === 0}
                      >
                        <button onClick={() => handleProjectsTab(0)}>
                          My Projects
                        </button>
                      </li>
                      <li
                        className="opdc-main--project__tab"
                        data-active={activeProjectsTab === 1}
                      >
                        <button onClick={() => handleProjectsTab(1)}>
                          Shared with me
                        </button>
                      </li>
                      <li className="opdc-main--project__tab pf-u-mt-lg">
                        <Link to="/?new=true">
                          <Button
                            variant="secondary"
                            icon={<ion-icon name="add-outline"></ion-icon>}
                          >
                            New Project
                          </Button>
                        </Link>
                      </li>
                    </ul>
                  </GridItem>
                  <GridItem span={10}>
                    {loading ? (
                      <Loader />
                    ) : (
                      <Grid hasGutter span={4}>
                        {filteredProjectCards}
                      </Grid>
                    )}
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem className="opdc-main--offerings">
            <Grid hasGutter>
              <GridItem
                span={12}
                className="pf-u-text-align-center pf-u-mt-2xl"
              >
                <Title headingLevel="h2">Offerings and Integrations</Title>
              </GridItem>
              <GridItem span={3}>
                <ul className="opdc-main--offerings__tabs">
                  {offerings.map((offering, index) => (
                    <li
                      className="opdc-main--offerings__tab"
                      data-active={
                        activeServicesTabKey === offering.label.toLowerCase()
                      }
                      key={offering.label}
                    >
                      <a
                        onClick={() => handleServicesTab(offering.label)}
                        href={'#' + offering.label.toLowerCase()}
                      >
                        {offering.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </GridItem>
              <GridItem span={9}>
                <Stack hasGutter>
                  {offerings.map((offering) => (
                    <StackItem
                      key={offering.label}
                      id={offering.label.toLowerCase()}
                      className="opdc-main--offerings__section"
                    >
                      <Grid hasGutter className="pf-u-text-align-center">
                        {offering.services.map((service) => (
                          <GridItem span={4} key={service.name}>
                            <Card
                              isRounded
                              className="opdc-offering--serviceCard"
                            >
                              <CardBody className="pf-u-text-align-center">
                                <div className="opdc-offering--serviceCard__icon">
                                  <img
                                    src={process.env.PUBLIC_URL + service.icon}
                                    alt={service.name}
                                  />
                                </div>
                                <Title
                                  headingLevel="h4"
                                  className="pf-u-mt-auto"
                                >
                                  {service.name}
                                </Title>
                              </CardBody>
                            </Card>
                          </GridItem>
                        ))}
                      </Grid>
                    </StackItem>
                  ))}
                </Stack>
              </GridItem>
            </Grid>
          </StackItem>
          <StackItem>
            <Card isRounded className="opdc-main--call2action">
              <CardBody>
                <Flex>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Title headingLevel="h3">Want to see how it works?</Title>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      variant="plain"
                      className="opdc-main--call2action__btn-primary"
                      isDisabled
                      aria-disabled
                    >
                      Explore a demo project
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      variant="link"
                      className="opdc-main--call2action__btn-link"
                      component="a"
                      href="/get-started/docs/console"
                      target="_blank"
                    >
                      Docs
                    </Button>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <footer className="pf-u-text-align-center pf-u-my-lg">
              <Text>Still not sure how to start?</Text>
              <Button
                className="pf-u-font-weight-bold pf-u-mt-sm"
                variant="link"
                component="a"
                href={`${config.common.contactLink}`}
                target="_blank"
              >
                Contact Us
              </Button>
            </footer>
          </StackItem>
        </Stack>
      </main>
    </>
  );
}

export default AppIndex;
