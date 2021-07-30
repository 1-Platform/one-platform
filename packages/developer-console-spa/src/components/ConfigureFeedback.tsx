import { Card, CardBody, Stack, StackItem, Form, FormGroup, Radio, Grid, GridItem, TextInput, Title, ActionGroup, Button, Popover, Tooltip } from '@patternfly/react-core';
import { isEqual } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import useFeedbackConfig from '../hooks/useFeedbackConfig';
import { updateFeedbackConfigService } from '../services/feedbackConfig';
import Header from './Header';
import Loader from './Loader';

function ConfigureFeedback ( props: any ) {
  const { appId, app, loading: appLoading } = useContext( AppContext );
  const { feedbackConfig, setFeedbackConfig, loading: feedbackConfigLoading } = useFeedbackConfig( appId );
  const [ editableFeedbackConfig, setEditableFeedbackConfig ] = useState( feedbackConfig );
  const [ canSubmit, setCanSubmit ] = useState( false );

  const feedbackTargets = [
    { isEnabled: true, id: 'JIRA', name: 'JIRA', description: process.env.REACT_APP_FEEDBACK_JIRA_API, url: process.env.REACT_APP_FEEDBACK_JIRA_API },
    { isEnabled: false, id: 'GITLAB', name: 'Gitlab', description: process.env.REACT_APP_FEEDBACK_GITLAB_API, url: process.env.REACT_APP_FEEDBACK_GITLAB_API },
    { isEnabled: false, id: 'GITHUB', name: 'GitHub', description: process.env.REACT_APP_FEEDBACK_GITHUB_API, url: process.env.REACT_APP_FEEDBACK_GITHUB_API },
    { isEnabled: false, id: 'EMAIL', name: 'Other', description: 'Other JIRA, Gitlab instances or Email', url: null },
  ];

  useEffect( () => {
    setEditableFeedbackConfig( feedbackConfig );
  }, [ feedbackConfig ] );

  useEffect( () => {
    setCanSubmit(
      !!editableFeedbackConfig.sourceType
      && !!editableFeedbackConfig.sourceApiUrl
      && editableFeedbackConfig.feedbackEmail
      && isSourceEnabled( editableFeedbackConfig.sourceType )
      && isFeedbackConfigChanged()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ editableFeedbackConfig ] );

  const handleSourceTypeSelect = (target: any) => {
    setEditableFeedbackConfig( { ...editableFeedbackConfig, sourceType: target.id, sourceApiUrl: target.url } );
  }
  const isSourceTypeSelected = ( sourceType: string ) => {
    return editableFeedbackConfig.sourceType === sourceType;
  };
  const isSourceEnabled = ( sourceType: string ) => {
    return feedbackTargets.findIndex( target => target.id === sourceType && target.isEnabled ) !== -1;
  }

  const isFeedbackConfigChanged = () => {
    return !isEqual( feedbackConfig, editableFeedbackConfig );
  }

  const saveFeedbackConfig = (event: any) => {
    event.preventDefault();

    if ( !canSubmit ) {
      return;
    }

    updateFeedbackConfigService( app.id, editableFeedbackConfig )
      .then( updatedApp => {
        setFeedbackConfig( editableFeedbackConfig );
        window.OpNotification?.success( { subject: 'Feedback Saved!' } );
      } )
      .catch( err => {
        window.OpNotification?.danger( {
          subject: 'An error occured when saving the changes.',
          body: 'Please try again later.',
        } );
      } );
  }

  const resetFeedbackConfig = ( event: any ) => {
    event.preventDefault();
    setEditableFeedbackConfig( feedbackConfig );
  }

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Header title="Configure Feedback" />
        </StackItem>

        { (appLoading || feedbackConfigLoading) &&
          <Loader/>
        }

        { !appLoading && !feedbackConfigLoading &&
          <StackItem>
            <Card isRounded>
              <CardBody>
                <Form onSubmit={ saveFeedbackConfig } onReset={ resetFeedbackConfig }>
                  <FormGroup
                    isRequired
                    fieldId="sourceType"
                    label="Feedback Target"
                    labelIcon={
                      <Popover
                        bodyContent="The target where the feeback should be submitted as an issue or a ticket."
                      >
                        <Button
                          variant="plain"
                          type="button"
                          aria-label="More info for name field"
                          onClick={ e => e.preventDefault() }
                          aria-describedby="simple-form-name-01"
                          className="pf-c-form__group-label-help"
                        >
                          <ion-icon name="help-circle-outline"></ion-icon>
                        </Button>
                      </Popover>
                    }>
                    <Grid hasGutter md={ 6 }>
                      { feedbackTargets.map( target => (
                        <GridItem key={ target.id }>

                          { !isSourceEnabled( target.id ) && (
                            <Tooltip position="bottom" content="This target is currently under development" reference={ () => document.getElementById( 'feedback-source-type--' + target.id ) as HTMLElement } />
                          ) }

                          <Card
                            id={ 'feedback-source-type--' + target.id }
                            isRounded isFlat isCompact
                            aria-disabled={ !isSourceEnabled( target.id ) }
                            isSelectable={ isSourceEnabled( target.id ) }
                            isSelected={ isSourceTypeSelected( target.id ) }
                            onClick={ () => target.isEnabled && handleSourceTypeSelect( target ) }>
                            <CardBody>
                              <Radio id={ target.id } name="sourceType" label={ target.name } description={ target.description } isChecked={ isSourceTypeSelected( target.id ) } />
                            </CardBody>
                          </Card>

                        </GridItem>
                      ) ) }
                    </Grid>
                  </FormGroup>

                  { editableFeedbackConfig.sourceType === 'JIRA' && <div className="jira-fields">
                    <Title headingLevel="h4">JIRA Configuration</Title>
                    <FormGroup fieldId="projectKey" label="Project Key" isRequired>
                      <TextInput
                        isRequired
                        id="projectKey"
                        name="projectKey"
                        aria-describedby="jira-project-key"
                        validated="default"
                        placeholder="Enter the JIRA project key (i.e. ONEPLAT)"
                        value={ editableFeedbackConfig.projectKey ?? '' }
                        onChange={ ( projectKey ) => setEditableFeedbackConfig( { ...editableFeedbackConfig, projectKey } ) }
                      ></TextInput>
                    </FormGroup>
                  </div> }

                  <FormGroup fieldId="feedbackEmail" label="Email Address" isRequired>
                    <TextInput
                      isRequired
                      id="feedbackEmail"
                      name="feedbackEmail"
                      aria-describedby="feedback-email"
                      validated="default"
                      placeholder="Provide a support email address"
                      value={ editableFeedbackConfig.feedbackEmail ?? '' }
                      onChange={ ( feedbackEmail ) => setEditableFeedbackConfig( { ...editableFeedbackConfig, feedbackEmail } ) }
                    ></TextInput>
                  </FormGroup>

                  <ActionGroup>
                    <Button variant="primary" type="submit" isDisabled={ !isFeedbackConfigChanged() }>Save</Button>
                    <Button variant="link" type="reset">Cancel</Button>
                  </ActionGroup>
                </Form>
              </CardBody>
            </Card>
          </StackItem>
        }
      </Stack>
    </>
  );
}

export default ConfigureFeedback;
