import { ActionGroup, Button, Form, FormGroup, TextArea, TextInput } from '@patternfly/react-core';
import gqlClient from '../../utils/gqlClient';
import { appByAppId, createAppDatabase } from '../../utils/gql-queries';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreateDBProps } from 'types';

interface IDBInput {
  dbname: string;
  description: string;
  appId: string;
}
const appSchema = yup.object().shape( {
  dbname: yup.string().required(),
  description: yup.string(),
} );

const  CreateDBForm = (props: CreateDBProps) => {
  const { control, handleSubmit, formState: { errors, isValid }, reset } = useForm<IDBInput>( {
    mode: 'onBlur',
    resolver: yupResolver( appSchema ),
    defaultValues: {
      dbname: '',
      description: '',
    },
  });

  function handleModalClose () {
    /* Reset the form */
    reset();
    props.setIsCreateDBFormOpen(false);
  }

  function submitForm ( db: IDBInput ) {
    gqlClient( {
      query: createAppDatabase,
      variables: {
        databaseName: db.dbname,
        id: props.appUniqueId,
        description: db.description
      }
    } )
      .then( (res: any) => {
        if ( res?.data?.createAppDatabase ) {
          window.OpNotification?.success( { subject: 'Database Created Successfully!' } );
          props.setIsCreateDBFormOpen( false );
          // Fetch & force refresh the latest app
          gqlClient( { query: appByAppId, variables: { appId: props.appId } } )
            .then( res => {
              if ( !res?.data?.app ) { return; }
              props.forceRefreshApp( res.data.app );
            } ).catch( (err: any) => {
              window.OpNotification?.danger( { subject: 'An error occurred when refreshing the app.', body: 'Please try again later.' } );
              console.error( err );
            });
        }
        if ( res.errors ) {
          window.OpNotification?.danger( { subject: 'An error occurred when creating the Database.', body: res.errors[0].message  } );
        }
      } ).catch( (err: any) => {
        window.OpNotification?.danger( { subject: 'An error occurred when creating the Database.', body: 'Please try again later.' } );
        console.error( err );
      });
  }

  return <>
    <Form noValidate={ false } onSubmit={ handleSubmit( submitForm ) } onReset={ handleModalClose }>
        <FormGroup
          label="Enter database name"
          isRequired
          fieldId="db-name"
          helperText="Please provide a name for your app"
          helperTextInvalid={ errors.dbname?.message }
          validated={errors.dbname ? 'error': 'default'}>
          <Controller
            name="dbname"
            control={ control }
            render={ ( { field } ) => (
              <TextInput
                {...field}
                type="text"
                id="app-name"
                aria-describedby="app-name-helper"
                validated={errors.dbname ? 'error' : 'default'}
                placeholder="Enter app name here..."/>
            )}/>
        </FormGroup>
        <FormGroup
          label="Database Description"
          fieldId="app-desc"
          helperText="Please provide a brief description of your database"
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
                placeholder="Enter database description here..." />
            ) } />
        </FormGroup>

        <ActionGroup>
          <Button variant="primary" type="submit" isDisabled={ !isValid }>Create Instance</Button>
          <Button variant="link" type="reset">Cancel</Button>
        </ActionGroup>
      </Form>
  </>;
}
export default CreateDBForm;
