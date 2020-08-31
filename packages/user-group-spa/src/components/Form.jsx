import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
  Form,
  FormGroup,
  TextInput,
  SearchInput,
  ActionGroup,
  Button,
  // Bullseye,
  // Spinner,
  // SimpleList,
  // SimpleListItem,
  // ChipGroup,
  // Chip,
  Title,
} from '@patternfly/react-core';
import GroupsAPI from '../services/GroupsAPI';

function GroupForm () {
  const [ group, setGroup ] = useState( {
    name: '',
    ldapCommonName: '',
    _id: undefined,
  } );
  const [ searchText, setSearchText ] = useState( '' );
  const [ searching, setSearching ] = useState( false );
  const [ searchResults, setSearchResults ] = useState( [] );
  const [ canSubmit, setCanSubmit ] = useState( false );
  const history = useHistory();

  const { cn } = useParams();
  useEffect( () => {
    let abort = false;
    if ( cn ) {
      GroupsAPI.getGroupByCn( cn )
        .then( res => {
          if ( abort ) {
            return;
          }
          if ( !res ) {
            throw new Error( 'Group not found' );
          }
          setGroup( res );
          // searchGroup( res.ldapCommonName );
        } )
        .catch( err => {
          if ( abort ) {
            return;
          }
          console.error( err );
          window.OpNotification.danger({
            subject: err.message,
            body: `There was some problem fetching the information for: ${cn}. For more details, see the console.`,
          } );
          history.replace( '/' );
        } );
    }
    return () => { abort = true; };
  }, [ cn, history ] );

  useEffect( () => {
    setCanSubmit( !!group.name && !!group.ldapCommonName );
  }, [ cn, group] );

  function searchGroup ( value ) {
    /* WKRD: Until the search group API is implemeted and available */
    selectGroup(null, { value });

    // setSearchText( value );
    // if ( value ) {
    //   setSearching( true );
    // GroupsAPI.searchGroups( value )
    //   .then( res => {
    //     setSearching( false );
    //     setSearchResults( res );
    //   } )
    //   .catch( err => {
    //     console.error( err );
    //     setSearching( false );
    //   } );
    // }
  }

  function selectGroup ( currentItem, { value } ) {
    if ( value !== group.ldapCommonName ) {
      setGroup( { ...group, ldapCommonName: value } );
    }
    setSearchText( value );
  }

  function selectedGroupMembers () {
    return searchResults.find( res => res.cn === group.ldapCommonName )?.members;
  }

  function submitForm (event) {
    event.preventDefault();

    if ( !canSubmit ) {
      return;
    }

    if ( !cn ) {
      addGroup( group );
    } else {
      updateGroup( group );
    }
  }

  function addGroup ( group ) {
    GroupsAPI.addGroup(group)
      .then((res) => {
        window.OpNotification.success( {
          subject: `Group created successfully!`,
          link: `./group/${ res.ldapCommonName }`
        } );
      })
      .catch((err) => {
        console.error(err);
        window.OpNotification.danger( {
          subject: 'Could not create the group',
          body: 'There was some error while trying to create the group. Please try again.'
        } );
      });
  }

  function updateGroup ( group ) {
    GroupsAPI.updateGroup(group)
      .then((res) => {
        window.OpNotification.success({
          subject: `Group updated successfully!`,
          link: `./group/${res.ldapCommonName}`,
        });
      })
      .catch((err) => {
        console.error( err );
        window.OpNotification.danger({
          subject: 'Could not update the group',
          body: 'There was some error while trying to update the group. Please try again.',
        });
      });
  }

  return (
    <Form onSubmit={submitForm}>
      <Title size="lg" headingLevel="h3">
        {cn ? "Edit" : "New"} Group
      </Title>
      <FormGroup label="Group Name" fieldId="groupName">
        <TextInput
          isRequired
          type="text"
          id="groupName"
          name="groupName"
          value={group.name}
          onChange={(value) => setGroup({ ...group, name: value })}
        />
      </FormGroup>
      <FormGroup label="Select Rover Group" fieldId="searchText">
        <SearchInput
          id="searchText"
          placeholder="Enter the Rover/LDAP common name..."
          value={group.ldapCommonName}
          onChange={searchGroup}
          resultsCount={searchResults.length || null}
          onClear={() => setSearchText("")}
          onKeyDown={(evt) => {
            if (evt.keyCode === 13) {
              evt.preventDefault();
            }
          }}
          disabled={searching}
        ></SearchInput>
      </FormGroup>

      {/* {(searching || searchResults.length > 0) && (
        <div className="search-results-container">
          {searching && (
            <Bullseye>
              <Spinner size="lg" />
            </Bullseye>
          )}

          {!searching && searchResults.length > 0 && (
            <SimpleList onSelect={selectGroup}>
              {searchResults.map((item, index) => {
                return (
                  <SimpleListItem
                    isCurrent={searchText === item.cn}
                    key={index}
                    value={item.cn}
                  >
                    {item.cn}
                  </SimpleListItem>
                );
              })}
            </SimpleList>
          )}
        </div>
      )}

      {selectedGroupMembers()?.length > 0 && (
        <FormGroup label="The Selected Group has the following members:">
          <ChipGroup>
            {selectedGroupMembers().map((member, index) => {
              return (
                <Chip key={member.uid} isReadOnly className="members-chip">
                  <ion-icon name="person-circle-outline"></ion-icon>
                  {member.name}
                </Chip>
              );
            })}
          </ChipGroup>
        </FormGroup>
      )} */}
      <ActionGroup>
        <Button variant="primary" type="submit" isDisabled={ !canSubmit }>
          {cn ? "Update" : "Add"} Group
        </Button>
        <Button variant="link" component={ Link } to={ cn ? `/group/${ cn }` : '/' }>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
}

export default GroupForm;
