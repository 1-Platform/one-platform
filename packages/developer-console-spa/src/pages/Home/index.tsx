import {
  Button,
  Card,
  CardBody,
  DropdownItem,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Pagination,
  Split,
  Stack,
  StackItem,
  Text,
  Title,
} from '@patternfly/react-core';
import Loader from 'common/components/Loader';
import ProjectCard from 'common/components/ProjectCard';
import { useDynamicScrollSpy } from 'common/hooks/useDynamicScrollSpy';
import useMyProjectsAPI from 'common/hooks/useMyProjectsAPI';
import config from 'config';
import NotFound from 'pages/NotFound';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import offerings from './app-services.json';
import './styles.css';
import HeroBg from 'assets/hero-bg.png';
import { usePagination } from 'common/hooks/usePagination';

const projectsTabs = [
  { label: 'My Projects', id: 'myProjects' },
  { label: 'Shared with me', id: 'shared' },
];

function AppIndex() {
  const { projects, loading } = useMyProjectsAPI();
  const [activeProjectsTab, setActiveProjectsTab] = useState(projectsTabs[0].id);

  const { pagination, onSetPage, onPerPageSelect } = usePagination({ page: 1, perPage: 2 });
  const { page: currentPage, perPage } = pagination;

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

  const handleProjectsTab = (tabId: string) => {
    setActiveProjectsTab(tabId);
  };

  const handleServicesTab = (tabKey: string) => {
    setActiveServicesTabKey(tabKey);
  };

  const cardDropdownItems = (appId: string) => [
    <DropdownItem
      key="edit"
      href={process.env.PUBLIC_URL + '/' + appId + '/settings'}
    >
      Edit Project
    </DropdownItem>,
    <DropdownItem
      key="delete"
      className="pf-u-danger-color-100"
      href={process.env.PUBLIC_URL + '/' + appId + '/settings?action=delete'}
    >
      Delete Project
    </DropdownItem>,
  ];

  const filteredProjects = useMemo( () => {
    return projectsTabs[0].id === activeProjectsTab ? projects : [];
  }, [activeProjectsTab, projects] );

  const renderFilteredProjectCards = () => {
    if ( projectsTabs.findIndex( tab => tab.id === activeProjectsTab ) === -1 ) {
      return (
        <NotFound/>
      );
    }

    if (filteredProjects.length === 0) {
      return (
        <EmptyState>
          <EmptyStateBody>
            <Title headingLevel="h3">Nothing to show here!</Title>
            <Text>
              You can create a new project by clicking on the 'New Project'
              button on the left!
            </Text>
          </EmptyStateBody>
        </EmptyState>
      );
    }

    const paginateProjects = (projectsList: Project[]) => {
      return projectsList.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
      );
    };

    return (
      <>
        <Grid hasGutter span={4}>
          {paginateProjects(filteredProjects)
            .map((project) => (
              <GridItem key={project.projectId}>
                <ProjectCard
                  project={project}
                  dropdownItems={cardDropdownItems(project.projectId)}
                />
              </GridItem>
            ))
            .reverse()}
        </Grid>
      </>
    );
  }

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
                    <Button
                      className="opdc-main--hero__cta-btn"
                      variant="primary"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Button
                    variant="link"
                    component="a"
                    className="opdc-main--hero__btn-link"
                    href="/get-started/docs/console"
                    target="_blank"
                  >
                    Docs
                  </Button>
                </Split>
              </GridItem>
              <GridItem
                md={4}
                order={{ default: '1', md: '2' }}
                className="opdc-main--hero__bg"
              >
                <img src={HeroBg} alt="hero" />
              </GridItem>
            </Grid>
          </StackItem>
          <StackItem id="project-cards">
            <Card isRounded className="pf-u-box-shadow-md">
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={2}>
                    <ul className="opdc-main--project__tabs">
                      {projectsTabs.map((tab) => (
                        <li
                          key={tab.id}
                          className="opdc-main--project__tab"
                          data-active={activeProjectsTab === tab.id}
                        >
                          <button onClick={() => handleProjectsTab(tab.id)}>
                            {tab.label}
                          </button>
                        </li>
                      ))}
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
                    {loading ? <Loader /> : renderFilteredProjectCards()}

                    {filteredProjects.length > perPage && (
                      <Pagination
                        itemCount={filteredProjects.length}
                        perPage={perPage}
                        page={currentPage}
                        onSetPage={(_, nextPage) => onSetPage(nextPage)}
                        onPerPageSelect={(_, newPerPage, newPage) => {
                          onPerPageSelect(newPerPage);
                          onSetPage(newPage);
                        } }
                        perPageOptions={[]}
                      />
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
