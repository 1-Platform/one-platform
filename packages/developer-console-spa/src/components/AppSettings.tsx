import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Loader from './Loader';
import {
  Card, CardTitle, CardBody, CardFooter,
  Form, FormGroup,
  Grid, GridItem,
  Title, Text, TextInput, TextArea,
  Stack, StackItem,
  Menu, MenuContent, MenuList, MenuItem, MenuItemAction,
  Switch, Button, Modal
} from '@patternfly/react-core';
import { deleteAppService, updateAppService } from '../services/app';
import { useHistory, useLocation } from 'react-router-dom';

function AppSettings () {
  const history = useHistory();
  const location = useLocation();
  const { app, loading, forceRefreshApp } = useContext( AppContext );
  const [ editableApp, setEditableApp ] = useState( app );
  const [ isDeleteModalOpen, setDeleteModalOpen ] = useState( false );
  const [ deleteAppConfirmation, setDeleteAppConformation ] = useState( '' );

  useEffect( () => {
    setEditableApp( app );
  }, [ app ] );

  useEffect( () => {
    const searchParams = new URLSearchParams( location.search );
    if ( searchParams.get('action') === 'delete' ) {
      setDeleteModalOpen( true );
    } else {
      setDeleteModalOpen( false );
    }
  }, [location] );

  const handleResetApp = (event: any) => {
    event.preventDefault();
    setEditableApp( app );
  }
  const handleSaveApp = (event: any) => {
    event.preventDefault();

    /* TODO: Add form validation */

    updateAppService( editableApp )
      .then( updatedApp => {
        forceRefreshApp( updatedApp );
        window.OpNotification.success( { subject: 'App Updated Succssfully!' } );
      } )
      .catch( err => {
        window.OpNotification.danger( { subject: 'An error occured when updating the App.', body: 'Please try again later.' } );
        console.error( err );
      } );
  }


  const handleAppDeactivateToggle = () => {
    /* TODO: gqlQuery for toggling `isActive` */
  }

  const handleDeleteApp = (event: any) => {
    event.preventDefault();
    deleteAppService( app.id )
      .then( () => {
        window.OpNotification.success( { subject: 'App Deleted Succssfully!' } );
        history.push( '/' );
      } )
      .catch( err => {
        window.OpNotification.danger( { subject: 'An error occured when deleting the App.', body: 'Please try again later.' } );
        console.error( err );
      } );
  }

  const handleModalClose = () => {
    /* Remove the new=true from the url search params */
    const searchParams = new URLSearchParams( location.search );
    searchParams.delete( 'action' );
    history.replace( { search: searchParams.toString() } );
    setDeleteAppConformation( '' );
  }

  if ( loading ) {
    return <Loader />;
  }
  return (
    <>
      <Card isPlain>
        <CardBody>
          <Title headingLevel="h1">App Settings</Title>
        </CardBody>
      </Card>
      <Stack hasGutter>
        <StackItem>
          <Form onSubmit={ handleSaveApp } onReset={ handleResetApp }>
            <Card isRounded>
              <CardBody>
                <Grid hasGutter>
                  <GridItem>
                    <FormGroup fieldId="name" label="App Name" isRequired>
                      <TextInput
                        id="name"
                        placeholder="Enter a name for your project"
                        value={ editableApp.name }
                        onChange={ name => setEditableApp( { ...editableApp, name } ) }
                        isRequired></TextInput>
                    </FormGroup>
                  </GridItem>
                  <GridItem>
                    <FormGroup fieldId="path" label="App Path" helperText="The path where your app will be hosted." isRequired>
                      <TextInput
                        id="path"
                        placeholder="/app-path"
                        value={ editableApp.path }
                        onChange={ path => setEditableApp( { ...editableApp, path } ) }
                        isRequired></TextInput>
                    </FormGroup>
                  </GridItem>
                  <GridItem>
                    <FormGroup fieldId="description" label="Description">
                      <TextArea
                        id="description"
                        placeholder="Enter a description for your project"
                        value={ editableApp.description }
                        onChange={ description => setEditableApp( { ...editableApp, description } ) }></TextArea>
                    </FormGroup>
                  </GridItem>
                </Grid>
              </CardBody>
              <CardFooter>
                <Button variant="primary" type="submit">Update</Button>
                <Button variant="link" type="reset">Discard</Button>
              </CardFooter>
            </Card>
          </Form>
        </StackItem>
        <StackItem>
          <Card isRounded isFlat style={ { border: '1px solid var(--pf-global--danger-color--100)', overflow: 'hidden'}}>
            <CardTitle className="pf-u-danger-color-100">Danger Zone</CardTitle>
            <Menu style={ { boxShadow: 'none' } }>
              <MenuContent>
                <MenuList>
                  <MenuItem
                    isDisabled
                    description="Deactivates the app from One Platform Menu and the Homepage"
                    itemId={ 0 }
                    actions={
                      <MenuItemAction
                        actionId="deactivate"
                        icon={ <Switch
                          isDisabled
                          id="deactivate-app"
                          aria-label="Deactivate app"
                          isChecked={ false }
                          value={editableApp.isActive}
                          onClick={ handleAppDeactivateToggle } /> }
                        aria-label="Deactivate the app" />
                    }>
                    Deactivate App
                    </MenuItem>
                  <MenuItem
                    description="Deletes the app from One Platform. Cannot be reverted."
                    itemId={ 1 }
                    onClick={ () => history.push({ search: 'action=delete' }) }
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
        aria-label="Delete App Modal"
        title="Are you sure?"
        titleIconVariant="danger"
        showClose={ true }
        onClose={ handleModalClose }>
        <Text>This action is irreversible and will permanently delete the <strong><em>{ app.name }</em></strong> app from One Platform.</Text>
        <br/>
        <Form onSubmit={ handleDeleteApp }>
          <FormGroup fieldId="delete-app" label={ `Please type "${ app.name }" to confirm` } isRequired>
            <TextInput id="delete-app" autoFocus onChange={ val => setDeleteAppConformation(val)} isRequired></TextInput>
          </FormGroup>
          <Button variant="danger" type="submit" isDisabled={ app.name !== deleteAppConfirmation }>I understand the consequences, delete this app</Button>
        </Form>
      </Modal>
    </>
  );
}

export default AppSettings;
