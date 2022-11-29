import {
  Card,
  CardBody,
  Stack,
  StackItem,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Modal,
  ModalVariant,
  Tabs,
  TabTitleText,
  Tab,
  FormGroup,
  ClipboardCopy,
  ClipboardCopyVariant,
  CardHeader,
  CardTitle,
  CardActions,
  CardExpandableContent,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import React, { useContext, useEffect, useState } from 'react';
import lhIllustration from 'assets/lighthouse_illust.png';
import CreateProjectForm from './CreateProjectForm';
import LinkProjectForm from './LinkProjectForm';
import { ProjectContext } from 'common/context/ProjectContext';
import Loader from '../../common/components/Loader';
import useLighthouseConfig from 'common/hooks/useLighthouseConfig';
import { HeaderContext } from 'common/context/HeaderContext';
import './styles.css';

const ConfigureLighthouse = (props: any) => {
  const {projectId, project, loading: appLoading } = useContext(ProjectContext);
  const { setHeader } = useContext(HeaderContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState({
    name: '',
    id: '',
    adminToken: '',
    token: '',
  });
  const [isCardExpanded, setIsCardExpanded] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {
    lighthouseConfig,
    setLighthouseConfig,
    loading: lighthouseConfigLoading,
  } = useLighthouseConfig(projectId);

  useEffect(() => {
    setHeader([{ title: 'Lighthouse', path: `/${projectId}/lighthouse` }]);
    return () => setHeader([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const lighthouseDocLink =
    'https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md';
  const lighthouseConfigDocLink =
    'https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md';
  const opLighthouseDocLink =
    window.location.origin + '/get-started/docs/lighthouse';
  const opLighthouseTokenGuideLink =
    window.location.origin +
    '/get-started/docs/lighthouse/guides#build-tokens-and-admin-tokens';
  const lighthouseSPALink = window.location.origin + '/lighthouse';

  // Modal helpers
  const editLHConfig = () => {
    setActiveTabKey(1);
    handleModalToggle();
  };
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    setShowConfirmation(false);
  };
  const handleTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  const onCardExpand = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const title = showConfirmation
    ? `New Project ${selectedProject.name} has been created`
    : (lighthouseConfig.appId ? 'Edit: ' : '') +
      'Link the app to a Lighthouse CI Project';

  return (
    <>
      <Stack hasGutter>
        {appLoading || lighthouseConfigLoading ? (
          <Loader />
        ) : !appLoading && !lighthouseConfig.appId ? ( // lgtm [js/trivial-conditional]
          <StackItem>
            <Card isRounded>
              <CardBody>
                <EmptyState>
                  <EmptyStateBody>
                    <img src={lhIllustration} alt="Lighthouse Illustration" />
                  </EmptyStateBody>
                  <Button onClick={handleModalToggle} variant="primary">
                    Get Started
                  </Button>
                  <EmptyStateSecondaryActions>
                    <Button
                      variant="link"
                      component="a"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={lighthouseDocLink}
                    >
                      Learn more
                    </Button>
                  </EmptyStateSecondaryActions>
                </EmptyState>
              </CardBody>
            </Card>
          </StackItem>
        ) : (
          <StackItem>
            <Card>
              <CardHeader>
                <CardActions>
                  <Button
                    onClick={editLHConfig}
                    aria-label="Delete Branch"
                    alt="Delete Branch"
                    variant="link"
                    icon={<ion-icon name="settings-outline"></ion-icon>}
                    iconPosition="right"
                  >
                    Manage Lighthouse Config
                  </Button>
                </CardActions>
                <CardTitle className="success-header-fontSize">
                  <ion-icon
                    name="checkmark-done-circle-outline"
                    class="pf-u-success-color-200"
                  ></ion-icon>
                  You are all set!
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Flex>
                  <FlexItem align={{ default: 'alignRight' }}>
                    <Button
                      variant="link"
                      component="a"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={opLighthouseDocLink}
                    >
                      Learn More
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      variant="link"
                      component="a"
                      href={lighthouseSPALink}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={<ion-icon name="open-outline"></ion-icon>}
                      iconPosition="right"
                    >
                      View my Lighthouse reports
                    </Button>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
            <br />
            <Card id="card2" isExpanded={isCardExpanded}>
              <CardHeader
                onExpand={onCardExpand}
                toggleButtonProps={{
                  id: 'toggle-button',
                  'aria-label': 'Details',
                  'aria-labelledby': 'titleId toggle-button',
                  'aria-expanded': isCardExpanded,
                }}
              >
                <CardTitle className="success-header-fontSize">
                  How do you use lighthouse CI?
                </CardTitle>
              </CardHeader>
              <CardExpandableContent>
                <CardBody>
                  <p>
                    To get started using Lighthouse, just add the following code
                    into 'lighthouserc.js' file to your project root:
                  </p>
                  <ClipboardCopy
                    isExpanded={true}
                    isCode
                    isReadOnly
                    hoverTip="Copy"
                    clickTip="Copied"
                    variant={ClipboardCopyVariant.expansion}
                  >
                    {`module.exports = {
    ci: {
      collect: {
        url: ['${window.location.origin + project.path}']
      },
      assert: {
        preset: 'lighthouse:recommended'
      },
    },
};`}
                  </ClipboardCopy>
                  <br />
                  <p>
                    And you can run the lighthouse tests for your app on your
                    dev environment, or in your CI scripts using:
                  </p>
                  <ClipboardCopy
                    isCode
                    isReadOnly
                    hoverTip="Copy"
                    clickTip="Copied"
                  >
                    lhci autorun -upload.token &lt;your_build_token&gt;
                  </ClipboardCopy>
                  <br />
                  <p>
                    For Advanced users who'd prefer to use CLI flags or keep the
                    configuration file in another location, refer to the{' '}
                    <a
                      href={lighthouseConfigDocLink}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      docs
                    </a>
                    .
                  </p>
                </CardBody>
              </CardExpandableContent>
            </Card>
          </StackItem>
        )}
      </Stack>
      {isModalOpen && (
        <Modal
          title={title}
          variant={ModalVariant.small}
          titleIconVariant={
            showConfirmation
              ? () => <ion-icon name="checkmark-circle-outline"></ion-icon>
              : undefined
          }
          isOpen={isModalOpen}
          onClose={handleModalToggle}
          onEscapePress={handleModalToggle}
        >
          {!showConfirmation ? (
            <>
              <div>
                You can link your app with a project on One Platform Lighthouse
                CI server
                <Button
                  component="a"
                  variant="link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={lighthouseDocLink}
                >
                  Learn more
                </Button>
              </div>
              <Tabs isFilled activeKey={activeTabKey} onSelect={handleTabClick}>
                <Tab
                  eventKey={0}
                  title={<TabTitleText>New Project</TabTitleText>}
                >
                  <CreateProjectForm
                    setSelectedProject={setSelectedProject}
                    setActiveTabKey={setActiveTabKey}
                    setShowConfirmation={setShowConfirmation}
                  />
                </Tab>
                <Tab
                  eventKey={1}
                  title={<TabTitleText>Link to existing Project</TabTitleText>}
                >
                  <br />
                  <LinkProjectForm
                    setActiveTabKey={setActiveTabKey}
                    lighthouseConfig={lighthouseConfig}
                    setLighthouseConfig={setLighthouseConfig}
                    setSelectedProject={setSelectedProject}
                    selectedProject={selectedProject}
                    setIsModalOpen={setIsModalOpen}
                  />
                </Tab>
              </Tabs>
            </>
          ) : (
            <>
              <div>
                Please note the following build and admin tokens for your
                lighthouse property
                <Button
                  variant="link"
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={opLighthouseTokenGuideLink}
                >
                  Learn more about these tokens
                </Button>
              </div>
              <br />
              <form>
                <FormGroup
                  fieldId=""
                  label="Build Token(Used to connect and upload reports)"
                >
                  <ClipboardCopy isReadOnly>
                    {selectedProject.token}
                  </ClipboardCopy>
                </FormGroup>
                <br />
                <FormGroup
                  fieldId=""
                  label="Admin Token(Used to manage the Project)"
                >
                  <ClipboardCopy isReadOnly>
                    {selectedProject.adminToken}
                  </ClipboardCopy>
                </FormGroup>
                <br />
                <p>
                  <b>Note:</b> Do not share these token or expose them in your
                  project source code.
                </p>
              </form>
              <br />
              <hr />
              <br />
              <LinkProjectForm
                selectedProject={selectedProject}
                branchVariant={true}
                setLighthouseConfig={setLighthouseConfig}
                setIsModalOpen={setIsModalOpen}
              />
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default ConfigureLighthouse;
