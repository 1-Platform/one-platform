import { ActionGroup, Button, Form, FormGroup, Modal, TextArea, TextInput } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import gqlClient from '../utils/gqlClient';
import { newApp } from '../utils/gql-queries';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface IAppInput {
  name: string;
  description: string;
}
const appSchema = yup.object().shape( {
  name: yup.string().trim().required(),
  description: yup.string().trim(),
} );

export default function AddAppForm () {
  const [ isOpen, setIsOpen ] = useState<boolean>();
  const location = useLocation();
  const history = useHistory();
  const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm<IAppInput>( {
    mode: 'onBlur',
    resolver: yupResolver( appSchema ),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect( () => {
    const searchParams = new URLSearchParams( location.search );
    if ( searchParams.get('new') === 'true' ) {
      setIsOpen( true );
    } else {
      setIsOpen( false );
    }
  }, [ location ] );

  function handleModalClose () {
    /* Reset the form */
    reset();
    /* Remove the new=true from the url search params */
    const searchParams = new URLSearchParams( location.search );
    searchParams.delete( 'new' );
    history.push( { search: searchParams.toString() } );
  }

  function submitForm ( app: IAppInput ) {
    gqlClient( { query: newApp, variables: { app } } )
      .then( res => {
        if ( res?.data?.app ) {
          window.OpNotification?.success( { subject: 'App Created Successfully!' } );
          history.push( res.data.app.appId );
        }
      } ).catch( err => {
        window.OpNotification?.danger( { subject: 'An error occurred when creating the App.', body: 'Please try again later.' } );
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

      <Form noValidate={ false } onSubmit={ handleSubmit( submitForm ) } onReset={ handleModalClose }>
        <FormGroup
          label="App Name"
          isRequired
          fieldId="app-name"
          helperText="Please provide a name for your app"
          helperTextInvalid={ errors.name?.message }
          validated={errors.name ? 'error': 'default'}>
          <Controller
            name="name"
            control={ control }
            render={ ( { field } ) => (
              <TextInput
                {...field}
                type="text"
                id="app-name"
                aria-describedby="app-name-helper"
                validated={errors.name ? 'error' : 'default'}
                placeholder="Enter app name here..."/>
            )}/>
        </FormGroup>
        <FormGroup
          label="App Description"
          fieldId="app-desc"
          helperText="Please provide a brief description of your app"
          helperTextInvalid={ errors.description?.message }
          validated={ errors.description ? 'error' : 'default' }>
          <Controller
            name="description"
            control={ control }
            render={ ( { field } ) => (
              <TextArea
                { ...field }
                id="app-desc"
                aria-describedby="app-desc-helper"
                validated={ errors.description ? 'error' : 'default' }
                placeholder="Enter app description here..." />
            ) } />
        </FormGroup>

        <ActionGroup>
          <Button variant="primary" type="submit" isDisabled={ !isValid }>Create App</Button>
          <Button variant="link" type="reset">Cancel</Button>
        </ActionGroup>
      </Form>
    </Modal>
  </>;
}
