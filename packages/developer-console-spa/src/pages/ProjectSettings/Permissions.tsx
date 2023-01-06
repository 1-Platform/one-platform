import { Badge, Button, Card, CardBody, EmptyState, EmptyStateBody, Menu, MenuContent, MenuItem, MenuItemAction, MenuList, SearchInput, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import Loader from 'common/components/Loader';
import useProjectPermissions from 'common/hooks/useProjectPermissions';
import { useCallback, useMemo, useState } from 'react';
import { updateProjectPermissionsService } from 'common/services/project';
import AddMemberForm from './components/AddMemberForm';

interface IPermissionsProps {
  project: Project;
}

export default function Permissions ( { project }: IPermissionsProps ) {
  const [ searchText, setSearchText ] = useState( '' );
  const { projectPermissions, setProjectPermissions, loading } = useProjectPermissions( project.projectId );
  const [ isFormOpen, setFormOpen ] = useState( false );

  const searchResults = useMemo( () => {
    const query = searchText.toLowerCase();
    return projectPermissions.filter( member => (
      member.name.toLowerCase().includes( query )
      || member.email.toLowerCase().includes( query )
      || member.role.toLowerCase().includes( query )
    ) );
  }, [ searchText, projectPermissions ] );

  const handleSearchInput = ( value: string ) => {
    setSearchText( value ?? '' );
  }

  const toggleForm = useCallback( () => {
    setFormOpen( !isFormOpen );
  }, [ isFormOpen ] );

  const addMember = useCallback( ( data: Project.Permission ) => {
    const permissions = [
      ...projectPermissions.filter( user => user.email !== data.email ),
      data,
    ];
    updateProjectPermissionsService( project.id, permissions )
      .then( res => {
        setProjectPermissions( res.permissions );
        toggleForm();
      } );
  }, [project.id, projectPermissions, setProjectPermissions, toggleForm] );

  const removeMember = useCallback( ( member: Project.Permission ) => {
    const permissions = projectPermissions.filter( user => user.refId !== member.refId );
    updateProjectPermissionsService( project.id, permissions )
      .then( res => {
        setProjectPermissions( res.permissions );
      } );
  }, [project.id, projectPermissions, setProjectPermissions] );

  return (
    <>
      <Card isRounded>
        <CardBody>
          <Stack hasGutter>
            <StackItem>
              <Split hasGutter>
                <SplitItem isFilled>
                  <SearchInput
                    placeholder="Search members"
                    value={ searchText }
                    onChange={ handleSearchInput }
                    onClear={ () => handleSearchInput( '' ) }
                    resultsCount={ searchResults.length.toString() }
                  />
                </SplitItem>
                <SplitItem>
                  <Button
                    variant={ isFormOpen ? 'secondary' : 'primary' }
                    type="button"
                    icon={ <ion-icon style={ { marginBottom: '-2px' } } name="person-add-outline"></ion-icon>}
                    onClick={ toggleForm }>
                    Add Member
                  </Button>
                </SplitItem>
              </Split>
            </StackItem>

            { isFormOpen && (
              <StackItem>
              <AddMemberForm onSubmit={ addMember } onCancel={ toggleForm } />
              </StackItem>
            ) }

            <StackItem>
              { loading && <Loader /> }

              { !loading && !projectPermissions.length && (
                <EmptyState>
                  <EmptyStateBody>
                    You have not granted anyone access to this project yet.
                  </EmptyStateBody>
                </EmptyState>
              ) }

              { !loading && projectPermissions.length > 0 && searchResults.length === 0 && (
                <EmptyState variant="xs">
                  <p>
                    No users found for search term: { searchText }
                  </p>
                  <Button
                    variant="link"
                    type="reset"
                    iconPosition="right"
                    icon={ <ion-icon style={{ marginBottom: '-2px' } } name="backspace-outline"></ion-icon> }
                    onClick={ () => handleSearchInput( '' ) }>
                    Clear Search
                  </Button>
                </EmptyState>
              ) }

              { !loading && searchResults.length > 0 && (
                <Menu>
                  <MenuContent>
                    <MenuList>
                      {/* TODO: Show owner as static at the top */}
                      { searchResults.map( ( member, index ) => (
                        <MenuItem
                          key={ index }
                          itemID={ member.refId }
                          description={ member.email }
                          title="Remove Member"
                          actions={
                            <MenuItemAction
                              icon={ <ion-icon name="person-remove-outline"></ion-icon> }
                              className="pf-u-danger-color-100"
                              onClick={ () => removeMember( member ) } />
                          }>
                          <span className="pf-u-mr-sm">{ member.name }</span>
                          <Badge isRead>{ member.role }</Badge>
                        </MenuItem>
                      ) ) }
                    </MenuList>
                  </MenuContent>
                </Menu>
              )}
            </StackItem>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
