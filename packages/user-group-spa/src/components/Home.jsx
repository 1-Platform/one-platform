import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStatePrimary,
  Spinner,
  Title,
  Pagination,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
} from '@patternfly/react-table';
import GroupsAPI from '../services/GroupsAPI';
import { BreadcrumbContext } from '../context/BreadcrumbContext';

function Home ( props ) {
  const [ searchText, setSearchText ] = useState( '' );
  const [ loading, setLoading ] = useState( true );
  const [ groups, setGroups ] = useState( [] );
  const [ searchResults, setSearchResults ] = useState( [] );
  const [ pagination, setPagination ] = useState( { page: 1, perPage: 10 } );
  const { updateCrumbs } = useContext(BreadcrumbContext);

  const history = useHistory();

  const tableColumns = [
    'Group Name',
    'LDAP/Rover Common Name',
  ];
  const tableActions = [
    {
      title: 'Edit Group',
      onClick: (evt, rowId, rowData) => {history.push('/group/edit/' + rowData[1])},
    }
  ];

  useEffect( () => {
    updateCrumbs( [] );
  }, [] );

  useEffect( () => {
    let abort = false;
    setLoading( true );
    GroupsAPI.listGroups()
      .then( res => {
        if ( abort ) {
          return;
        }
        setGroups( res );
        setLoading( false );
      } )
      .catch( err => {
        if ( abort ) {
          return;
        }
        console.error( err );
        window.OpNotification && window.OpNotification.danger( { subject: 'There was some error fetching the list of groups' } );
      });
  }, [ ] );

  useEffect( () => {
    const searchQuery = RegExp( searchText, 'i' );
    setSearchResults(
      groups
        .filter(
          (group) =>
            searchQuery.test(group.name) ||
            searchQuery.test(group.cn)
        )
        .map( ( group ) => [
          {
            title: <Link to={ `/group/${ group.cn }` }>{ group.name }</Link>
          },
          group.cn
        ] )
    );
  }, [searchText, groups, pagination]);

  function EmptyMessage () {
    if ( !loading && searchResults.length !== 0 ) {
      return '';
    }

    const iconComponent = loading
      ? Spinner
      : () => <ion-icon name="search-outline"></ion-icon>;

    const title = loading
      ? 'Loading'
      : 'No Groups Found';

    const body = !loading && searchText
      ? 'No groups found matching the search term. Remove the search to view all groups.'
      : 'No Group available. Please use the "Add New Group" button to add a Group.';

    const primaryButton = searchText
      ? <Button variant="link" onClick={ () => setSearchText( '' ) }> Clear Search</Button>
      : <Button variant="link" component={Link} to="/group/new">Add New Group</Button>

    return (
      <EmptyState>
        <EmptyStateIcon
          variant="container"
          component={iconComponent}
        />
        <Title size="lg" headingLevel="h4">
          {title}
        </Title>
        {!loading && body && <EmptyStateBody>{body}</EmptyStateBody>}
        {!loading && <EmptyStatePrimary>{primaryButton}</EmptyStatePrimary>}
      </EmptyState>
    );
  }

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem variant="search-filter">
            <SearchInput
              id="searchText"
              className="search-text-input"
              placeholder="Search user group by name"
              value={searchText}
              onChange={setSearchText}
              onClear={() => setSearchText("")}
            ></SearchInput>
          </ToolbarItem>
          <ToolbarItem alignment={{ default: "alignRight" }}>
            <Button variant="secondary" component={Link} to="/group/new">
              Add New Group
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table
        aria-label="List of all Groups in One Platform"
        borders={false}
        actions={tableActions}
        cells={tableColumns}
        rows={searchResults.slice(
          pagination.perPage * (pagination.page - 1),
          pagination.perPage * pagination.page
        )}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <EmptyMessage />

      { searchResults.length > 0 && (
        <Pagination
          itemCount={ searchResults.length }
          perPage={ pagination.perPage }
          page={ pagination.page }
          onSetPage={ ( evt, page ) => setPagination( { ...pagination, page } ) }
          onPerPageSelect={ ( evt, perPage ) =>
            setPagination( { ...pagination, perPage } )
          }
        />
      ) }
    </>
  );
}

export default Home;
