import { ActionGroup, Button, Form, FormGroup, Modal, TextArea, TextInput } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import gqlClient from '../utils/gqlClient';
import { newApp } from '../utils/gql-queries';

export default function AppAppForm () {
  const emptyAppObject = {
    name: '',
    path: '',
    description: '',
  };
  const [ app, setApp ] = useState<any>(emptyAppObject);
  const [ isOpen, setIsOpen ] = useState<boolean>();
  const location = useLocation();
  const history = useHistory();

  useEffect( () => {
    const searchParams = new URLSearchParams( location.search );
    if ( searchParams.get('new') === 'true' ) {
      setIsOpen( true );
    } else {
      setIsOpen( false );
    }
  }, [ location ] );

  function handleModalClose () {
    setIsOpen( false );
    setApp( emptyAppObject );
    /* Remove the new=true from the url search params */
    const searchParams = new URLSearchParams( location.search );
    searchParams.delete( 'new' );
    history.push( { search: searchParams.toString() } );
  }

  function handleFormSubmit (event: any) {
    event.preventDefault();
    /* TODO: Form validation before submitting */
    gqlClient( { query: newApp, variables: { app } } )
      .then( res => {
        if ( res?.data?.app ) {
          window.OpNotification.success( { subject: 'App Created Succssfully!' } );
          history.push( res.data.app.appId );
        }
      } ).catch( err => {
        window.OpNotification.danger( { subject: 'An error occured when deleting the App.', body: 'Please try again later.' } );
        console.error( err );
      });
  }

  return <>
    <Modal
      variant="small"
      title="Create a New App"
      isOpen={ isOpen }
      onClose={ handleModalClose }
      showClose={false}>

      <Form noValidate={false} onSubmitCapture={handleFormSubmit}>
        <FormGroup
          label="App Name"
          isRequired
          fieldId="app-name"
          helperText="Please provide a name for your app">
          <TextInput
            isRequired
            type="text"
            id="app-name"
            name="app-name"
            aria-describedby="app-name-helper"
            validated="default"
            placeholder="Enter app name here..."
            value={ app.name }
            onChange={ ( name ) => setApp( { ...app, name } ) } />
        </FormGroup>
        <FormGroup
          label="App Path"
          isRequired
          fieldId="app-path"
          helperText="Please provide the path/url for your app">
          <TextInput
            isRequired
            type="text"
            id="app-path"
            name="app-path"
            aria-describedby="app-path-helper"
            validated="default"
            placeholder="Enter app path here..."
            value={ app.path }
            onChange={ ( path ) => setApp( { ...app, path } ) } />
        </FormGroup>
        <FormGroup
          label="App Description"
          fieldId="app-desc"
          helperText="Please provide a brief description of your app">
          <TextArea
            id="app-desc"
            name="app-desc"
            aria-describedby="app-desc-helper"
            placeholder="Enter app description here..."
            value={ app.description }
            onChange={ ( description ) => setApp( { ...app, description } ) } />
        </FormGroup>

        <ActionGroup>
          <Button variant="primary" type="submit">Create App</Button>
          <Button variant="link" type="reset" onClick={ handleModalClose }>Cancel</Button>
        </ActionGroup>
      </Form>
    </Modal>
  </>;
}
