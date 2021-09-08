import {
  Card, CardBody, Stack, StackItem,
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
  FlexItem
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import SettingsIcon from '@patternfly/react-icons/dist/esm/icons/cog-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import React, { useContext, useState } from 'react';
import Header from './Header';
import lhIllustration from "../assets/lighthouse_illust.png";
import CreateProjectForm from './lighthouse/CreateProjectForm';
import LinkProjectForm from './lighthouse/LinkProjectForm';
import { AppContext } from '../context/AppContext';
import Loader from './Loader';
import useLighthouseConfig from '../hooks/useLighthouseConfig';

const ConfigureLighthouse = ( props: any ) => {
  const [ isModalOpen, setIsModalOpen ] = useState( false );
  const [ activeTabKey, setActiveTabKey ] = useState( 0 );
  const [ selectedProject, setSelectedProject ] = useState( {
    name: '',
    id: '',
    adminToken: '',
    token: ''
  });
  const [ isCardExpanded, setIsCardExpanded ] = useState( true );
  const [ showConfirmation, setShowConfirmation ] = useState( false );
  const { app, loading: appLoading } = useContext( AppContext );
  const { lighthouseConfig, setLighthouseConfig, loading: lighthouseConfigLoading } = useLighthouseConfig( app.id );

  // Modal helpers
  const editLHConfig = () => {
    setActiveTabKey( 1 );
    handleModalToggle();
  }
  const handleModalToggle = () => {
    setIsModalOpen( !isModalOpen );
    setShowConfirmation(false);
  }
  const handleTabClick = ( event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number ) => {
    setActiveTabKey(tabIndex as number);
  }
  const openLighthouseDoc = () => {
    window.open('https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md', '_blank' );
  };
  const openLighthouseConfigDoc = () => {
    window.open( 'https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md', '_blank' );
  };
  const openOPLighthouseDoc = () => {
    window.open('/get-started/docs/apps/internal/lighthouse', '_blank' );
  };

  const onCardExpand = () => {
    setIsCardExpanded( !isCardExpanded );
  };

  const title = showConfirmation
      ?
    `New Project ${ selectedProject.name } has been created`
    :
    (lighthouseConfig.appId? 'Edit: ': '') + 'Link the app to a Lighthouse CI Project';

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Header title="Configure Lighthouse" />
        </StackItem>
        {
          ( appLoading || lighthouseConfigLoading )
        ?
          <Loader />
        :
         ( !appLoading && !lighthouseConfig.appId ) ?
          <StackItem>
            <Card isRounded>
              <CardBody>
                <EmptyState>
                  <EmptyStateBody>
                    <img src={ lhIllustration } alt="Lighthouse Illustration" />
                  </EmptyStateBody>
                  <Button onClick={ handleModalToggle } variant="primary">Get Started</Button>
                  <EmptyStateSecondaryActions>
                    <Button variant="link" onClick={ openOPLighthouseDoc }>Learn more</Button>
                  </EmptyStateSecondaryActions>
                </EmptyState>
              </CardBody>
            </Card>
          </StackItem>
        :
          <StackItem>
            <Card>
              <CardHeader>
                <CardActions>
                  <Button
                    onClick={ editLHConfig }
                    aria-label="Delete Branch"
                    alt="Delete Branch" variant="link">
                    Manage Lighthouse Config &nbsp;<SettingsIcon />
                  </Button>
                </CardActions>
                <CardTitle className="success-header-fontSize success-header-fontColor">
                  <CheckCircleIcon /> You are all set!
                </CardTitle>
              </CardHeader>
                <CardBody>
                <Flex>
                  <FlexItem align={ { default: 'alignRight' } }>
                    <Button variant="link" onClick={ openLighthouseDoc }>Learn More</Button>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="link">View my Lighthouse reports    <ExternalLinkAltIcon /></Button>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
            <br />
            <Card id="card2" isExpanded={ isCardExpanded }>
              <CardHeader
                onExpand={ onCardExpand }
                toggleButtonProps={ {
                  id: 'toggle-button',
                  'aria-label': 'Details',
                  'aria-labelledby': 'titleId toggle-button',
                  'aria-expanded': isCardExpanded
                } }
              >
                <CardTitle className="success-header-fontSize">
                  How do you use lighthouse CI?
                </CardTitle>
              </CardHeader>
              <CardExpandableContent>
                <CardBody>
                  <p>To get started using Lighthouse, just add the following code into 'lighthouserc.js' file to your project root:</p>
                  <ClipboardCopy isExpanded={ true } isCode isReadOnly hoverTip="Copy" clickTip="Copied" variant={ ClipboardCopyVariant.expansion }>
                    {
`module.exports = {
    ci: {
      collect: {
        url: ['${ window.location.origin + app.path }']
      },
      assert: {
        preset: 'lighthouse:recommended'
      },
    },
};`
                    }
                  </ClipboardCopy>
                  <br />
                  <p>And you can run the lighthouse tests for your app on your dev environment, or in your CI scripts using:</p>
                  <ClipboardCopy isCode isReadOnly hoverTip="Copy" clickTip="Copied">
                    lhci autorun -upload.token &lt;your_build_token&gt;
                  </ClipboardCopy>
                  <br />
                  <p>For Advanced users who'd prefer to use CLI flags or keep the configuration file in another location, refer to the <Button variant="link" onClick={ openLighthouseConfigDoc }>docs</Button></p>
                </CardBody>
              </CardExpandableContent>
            </Card>
          </StackItem>
        }
      </Stack>
      { isModalOpen &&
        <Modal
          title={ title }
            variant={ ModalVariant.small }
            titleIconVariant={ showConfirmation? CheckCircleIcon : null }
            isOpen={isModalOpen}
            onClose={handleModalToggle}
            onEscapePress={handleModalToggle}
      >
          { !showConfirmation ? <>
          <div>
            You can link your app with a project on One Platform Lighthouse CI server<Button variant="link" onClick={openLighthouseDoc}>Learn more</Button>
          </div>
          <Tabs isFilled activeKey={activeTabKey} onSelect={handleTabClick}>
            <Tab eventKey={0} title={<TabTitleText>New Project</TabTitleText>}>
              <CreateProjectForm
                setSelectedProject={ setSelectedProject }
                setActiveTabKey={ setActiveTabKey }
                setShowConfirmation={ setShowConfirmation }/>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Link to existing Project</TabTitleText>}>
              <br/>
              <LinkProjectForm
                setActiveTabKey={ setActiveTabKey }
                lighthouseConfig={ lighthouseConfig }
                setLighthouseConfig={ setLighthouseConfig }
                setSelectedProject = { setSelectedProject }
                selectedProject={ selectedProject }
                setIsModalOpen={ setIsModalOpen } />
            </Tab>
          </Tabs>
          </>
          :
          <>
            <div>
              Please note the following build and admin tokens for your lighthouse property<Button variant="link">Learn more about these tokens</Button>
            </div>
            <br/>
            <form>
              <FormGroup fieldId="" label="Build Token(Used to connect and upload reports)">
                <ClipboardCopy isReadOnly>{selectedProject.token}</ClipboardCopy>
              </FormGroup>
              <br/>
              <FormGroup fieldId="" label="Admin Token(Used to manage the Project)">
                <ClipboardCopy isReadOnly>{selectedProject.adminToken}</ClipboardCopy>
              </FormGroup>
              <br/>
              <p>
               <b>Note:</b> Do not share these token or expose them in your project source code.
              </p>
            </form>
            <br/>
            <hr />
            <br/>
            <LinkProjectForm
              selectedProject={ selectedProject }
              setLighthouseConfig={ setLighthouseConfig }
              setIsModalOpen={ setIsModalOpen }
              branchVariant={ true } />
          </>
        }
        </Modal>
      }
    </>
  );
}

export default ConfigureLighthouse;
