import { FormEventHandler, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Card, CardTitle, CardBody, CardFooter,
  Form, FormGroup,
  Grid, GridItem,
  Text, TextInput, TextArea,
  Stack, StackItem,
  Menu, MenuContent, MenuList, MenuItem, MenuItemAction,
  Button, Modal
} from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { deleteProjectService, updateProjectService } from 'common/services/project';
import { ProjectContext } from 'common/context/ProjectContext';
import useQueryParams from 'common/hooks/useQueryParams';

interface IAppInput {
  name: string;
  description: string;
}
const formSchema = yup.object().shape( {
  name: yup.string().required(),
  description: yup.string(),
} );

interface IGeneralSettings {
  project: any;
}

export default function General ( { project }: IGeneralSettings ) {
  const { projectId, forceRefresh } = useContext( ProjectContext );
  const [ isDeleteModalOpen, setDeleteModalOpen ] = useState( false );
  const [ deleteProjectConfirmation, setDeleteProjectConfirmation ] = useState( '' );
  const history = useHistory();
  const searchParams = useQueryParams();
  const { control, handleSubmit, formState: { errors, isValid }, watch, reset } = useForm<IAppInput>( {
    mode: 'onBlur',
    resolver: yupResolver( formSchema ),
    defaultValues: {
      name: '',
      description: ''
    },
  } );
  const [ isSaving, setIsSaving ] = useState( false );

  const editedName = watch( 'name' );
  const editedDescription = watch( 'description' );
  const isChanged = useMemo( () => {
    return editedName !== project.name || editedDescription !== project.description;
  }, [project, editedName, editedDescription] );

  const handleReset = useCallback( () => {
    reset( {
      name: project.name,
      description: project.description
    } );
  }, [ project, reset ] );

  const handleSaveApp = useCallback(( data: any ) => {
    setIsSaving( true );
    updateProjectService( projectId, data )
      .then( updatedApp => {
        forceRefresh( updatedApp );
        window.OpNotification?.success( { subject: 'Project Updated Successfully!' } );
        setIsSaving( false );
      } )
      .catch( err => {
        window.OpNotification?.danger( { subject: 'An error occurred when updating the Project.', body: 'Please try again later.' } );
        console.error( err );
        setIsSaving( false );
      } );
  }, [forceRefresh, projectId] );

  useEffect( () => {
    handleReset();
  }, [ project, handleReset ] );

  useEffect( () => {
    setDeleteModalOpen(searchParams.get('action') === 'delete');
  }, [searchParams] );

  const handleOwnershipTransferToggle = () => {
    /* TODO: gqlQuery for toggling ownership transfer */
  };

  const handleDeleteApp: FormEventHandler = ( event ) => {
    event.preventDefault();
    deleteProjectService( project.id )
      .then( () => {
        window.OpNotification?.success( { subject: 'Project Deleted Successfully!' } );
        history.push( '/' );
      } )
      .catch( err => {
        window.OpNotification?.danger( { subject: 'An error occurred when deleting the Project.', body: 'Please try again later.' } );
        console.error( err );
      } );
  };

  const handleModalClose = () => {
    /* Remove the action=delete from the url search params */
    searchParams.delete( 'action' );
    history.replace( { search: searchParams.toString() } );
    setDeleteProjectConfirmation( '' );
  };

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Form onSubmit={ handleSubmit( handleSaveApp ) } onReset={ handleReset }>
            <Card isRounded>
              <CardBody>
                <Grid hasGutter>
                  <GridItem>
                    <FormGroup
                      isRequired
                      fieldId="name"
                      label="Project Name"
                      helperText="Name of the project"
                      helperTextInvalid={ errors.name?.message }
                      validated={errors.name ? 'error' : 'default' }>
                      <Controller
                        name="name"
                        control={ control }
                        render={ ( { field } ) => (
                          <TextInput
                            { ...field }
                            id="name"
                            placeholder="Enter a name for your project"
                            validated={ errors.name ? 'error' : 'default' }
                            isRequired></TextInput>
                        ) }/>
                    </FormGroup>
                  </GridItem>
                  <GridItem>
                    <FormGroup
                      fieldId="description"
                      label="Description"
                      helperText="Describe the project"
                      helperTextInvalid={ errors.description?.message }
                      validated={errors.description ? 'error' : 'default' }>
                      <Controller
                        name="description"
                        control={ control }
                        render={ ( { field } ) => (
                          <TextArea
                            { ...field }
                            id="description"
                            rows={ 3 }
                            validated={errors.description ? 'error' : 'default' }
                            placeholder="Enter a description for your project" />
                        )} />
                    </FormGroup>
                  </GridItem>
                </Grid>
              </CardBody>
              <CardFooter>
                <Button variant="primary" type="submit" isLoading={ isSaving } isDisabled={ !isValid || !isChanged || isSaving }>Save</Button>
                <Button variant="plain" type="reset">Reset</Button>
              </CardFooter>
            </Card>
          </Form>
        </StackItem>
        <StackItem>
          <Card isRounded style={ { border: '1px solid var(--pf-global--danger-color--100)', overflow: 'hidden' } }>
            <CardTitle className="pf-u-danger-color-100">Advanced Settings</CardTitle>
            <Menu style={ { boxShadow: 'none' } }>
              <MenuContent>
                <MenuList>
                  <MenuItem
                    description="Transfer this project to another user"
                    itemId={ 0 }
                    onClick={ handleOwnershipTransferToggle }
                    actions={
                      <MenuItemAction
                        actionId="transfer"
                        icon={ <ion-icon name="swap-horizontal-outline"></ion-icon> }
                        aria-label="Transfer ownership" />
                    }>
                    Transfer ownership
                  </MenuItem>
                  <MenuItem
                    description="Deletes the app from One Platform. Cannot be reverted."
                    itemId={ 1 }
                    onClick={ () => history.push( { search: 'action=delete' } ) }
                    actions={
                      <MenuItemAction
                        actionId="delete"
                        icon={ <ion-icon class="pf-u-danger-color-100" name="trash" /> }
                        aria-label="Delete the app" />
                    }>
                    <span className="pf-u-danger-color-100">Delete this App</span>
                  </MenuItem>
                </MenuList>
              </MenuContent>
            </Menu>
          </Card>
        </StackItem>
      </Stack>
      <Modal
        variant="small"
        isOpen={ isDeleteModalOpen }
        aria-label="Delete Project Modal"
        title="Are you sure?"
        titleIconVariant="danger"
        showClose={ true }
        onClose={ handleModalClose }>
        <Text>This action is irreversible and will permanently delete the <strong><em>{ project.name }</em></strong> project from One Platform.</Text>
        <br />
        <Form onSubmit={ handleDeleteApp }>
          <FormGroup fieldId="delete-app" label={ `Please type "${ project.name }" to confirm` } isRequired>
            <TextInput id="delete-app" autoFocus onChange={ val => setDeleteProjectConfirmation( val ) } isRequired></TextInput>
          </FormGroup>
          <Button variant="danger" type="submit" isDisabled={ project.name !== deleteProjectConfirmation }>I understand the consequences, delete this project</Button>
        </Form>
      </Modal>
    </>
  );
}
