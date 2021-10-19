import { yupResolver } from '@hookform/resolvers/yup';
import { ActionGroup, Button, Card, CardBody, Form, FormGroup, Grid, GridItem, Select, SelectOption, SelectOptionObject } from '@patternfly/react-core';
import useDebounceEffect from 'hooks/useDebounceEffect';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { findUsers } from 'services/userGroup';
import * as yup from 'yup';

const formSchema = yup.object().shape( {
  search: yup.string(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  refId: yup.string().required(),
  refType: yup.string().required(),
  role: yup.string().required(),
  customRoles: yup.array().of( yup.string() )
} );

interface IAddMemberFormProps {
  onCancel?: () => void;
  onSubmit?: ( member: App.Permission ) => void;
}

export default function AddMemberForm ( { onCancel, onSubmit }: IAddMemberFormProps ) {
  const { control, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm<App.Permission>( {
    mode: 'onBlur',
    resolver: yupResolver( formSchema ),
  } );
  const [ searchText, setSearchText ] = useState( '' );
  const [ isRolesDropDownOpen, setRolesDropDownOpen ] = useState( false );
  const [ searchResults, setSearchResults ] = useState<User[]>( [] );
  const [ isAutocompleteOpen, setAutocompleteOpen ] = useState( false );
  const [ isSearching, setSearching ] = useState( false );

  const roles = [
    { name: 'Editor', description: 'Full edit access' },
    { name: 'Viewer', description: 'Read only access' }
  ];

  useDebounceEffect( () => {
    if ( !searchText || searchText.length < 3 || searchText === watch('email') ) {
      setSearching( false );
      return;
    }
    setAutocompleteOpen( true );
    setSearching( true );
    const abortController = new AbortController();
    const signal = abortController.signal;
    findUsers( searchText, signal ).then( users => {
      setSearchResults( users );
      setSearching( false );
    } );
    return () => abortController.abort();
  }, [ searchText ] );

  const handleSearchToggle = useCallback( (state: boolean) => {
    setAutocompleteOpen( state );
    if ( state ) {
      setSearching( state );
    }
  }, [] );

  const handleRoleSelect = useCallback( ( onChange: any, value: string | SelectOptionObject ) => {
    onChange( value );
    setRolesDropDownOpen( false );
  }, [] );

  const selectMember = useCallback( ( user: User ) => {
    setValue( 'name', user.name ?? '' );
    setValue( 'email', user.email ?? '' );
    setValue( 'refId', user.id ?? '' );
    setValue( 'refType', 'User' );
  }, [ setValue ] );

  const dismissSelectedMember = useCallback( () => {
    setValue( 'name', '' );
    setValue( 'email', '' );
    setValue( 'refId', '' );
  }, [ setValue ] );

  const handleMemberSelect = useCallback( ( email: string | SelectOptionObject ) => {
    setAutocompleteOpen( false );

    const user = searchResults.find(result => result.email === email)
    if ( user ) {
      selectMember( user );
    }
  }, [searchResults, selectMember] );

  const handleCancel = useCallback( () => {
    reset();
    onCancel?.();
  }, [ onCancel, reset ] );

  const addMember = useCallback( ( data: App.Permission ) => {
    onSubmit?.(data);
  }, [ onSubmit ] );

  useEffect( () => {
    /* Close and reset the form on unmount */
    return () => handleCancel();
  }, [ handleCancel ] );

  const autocomplete = useMemo( () => {
    if ( isSearching ) {
      return;
    }
    return searchResults
      .filter( user => user.id && user.email )
      .map( ( user, index ) => (
        <SelectOption key={ index } value={ user.email } description={ user.name } />
      ) );
  }, [ searchResults, isSearching ] );

  const noResultsMessage = useMemo( () => {
    if ( searchText.length < 3 ) {
      return 'Enter atleast 3 characters';
    }
    if ( isSearching ) {
      return 'Searching...';
    }
    if ( searchResults.length === 0 ) {
      return 'No users found matching: ' + searchText
    }
  }, [isSearching, searchResults.length, searchText] );

  return (
    <>
      <Card isHoverable isRounded className="pf-u-box-shadow-lg">
        <CardBody>
          <Form onSubmit={ handleSubmit( addMember ) } onReset={ handleCancel }>
            <Grid hasGutter>
              <GridItem colSpan={ 12 } md={ 8 }>
                <FormGroup
                  isRequired
                  fieldId="email"
                  label="Email Address"
                  helperTextInvalid={ errors.email?.message }
                  validated={ errors.email ? 'error' : 'default' }>
                  <Controller
                    name="email"
                    control={ control }
                    render={ ( { field } ) => (
                      <Select
                        { ...field }
                        variant="typeahead"
                        placeholderText="Search user by email address"
                        noResultsFoundText={ noResultsMessage }
                        isOpen={ isAutocompleteOpen }
                        onToggle={ () => handleSearchToggle( !isAutocompleteOpen ) }
                        selections={ field.value }
                        onTypeaheadInputChanged={ setSearchText }
                        onSelect={ ( event, value ) => handleMemberSelect( value ) }
                        onClear={ dismissSelectedMember }
                        validated={ errors.email ? 'error' : 'default' }>
                        { autocomplete }
                      </Select>
                    ) } />
                </FormGroup>
              </GridItem>
              <GridItem colSpan={ 12 } md={ 4 }>
                <FormGroup
                  isRequired
                  fieldId="role"
                  label="Role"
                  helperTextInvalid={ errors.role?.message }
                  validated={errors.role ? 'error' : 'default'}>
                  <Controller
                    name="role"
                    control={ control }
                    render={ ( { field } ) => (
                      <Select
                        { ...field }
                        variant="single"
                        placeholderText="Select a role"
                        isOpen={ isRolesDropDownOpen }
                        onToggle={ () => setRolesDropDownOpen( !isRolesDropDownOpen ) }
                        selections={ field.value }
                        onSelect={ ( event, value ) => handleRoleSelect( field.onChange, value ) }
                        validated={ errors.role ? 'error' : 'default' }>
                        { roles.map( ( role, index ) => (
                          <SelectOption key={ index } value={ role.name } description={ role.description } />
                        ) ) }
                      </Select>
                    ) } />
                </FormGroup>
              </GridItem>
            </Grid>
            <ActionGroup>
              <Button
                variant="primary"
                icon={ <ion-icon style={ { marginBottom: '-2px' } } name="person-add-outline"></ion-icon> }
                type="submit">
                Add member
              </Button>
              <Button variant="plain" type="reset">Cancel</Button>
            </ActionGroup>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}
