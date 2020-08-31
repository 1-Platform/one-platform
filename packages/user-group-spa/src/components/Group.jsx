import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
  Badge,
  Button,
  Chip,
  ChipGroup,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Divider,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Page,
  PageSection,
  PageSectionVariants,
  Spinner,
  Text,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import GroupsAPI from '../services/GroupsAPI';

function Group ( props ) {
  const { cn } = useParams();
  const history = useHistory();

  const [ group, setGroup ] = useState( {
    _id: '',
    name: cn,
    ldapCommonName: cn,
    createdOn: null,
    updatedOn: null,
  } );
  const [ members, setMembers ] = useState( [] );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    setLoading( true );
    let abort = false;
    if ( cn ) {
      GroupsAPI.getGroupDetailsByCn( cn )
        .then( res => {
          if ( abort ) {
            return;
          }
          if ( !res ) {
            throw new Error( 'Group not found' );
          }
          setGroup( res.group );
          setMembers( res.members );
          setLoading( false );
        } )
        .catch( err => {
          console.error( err );
          window.OpNotification.danger({
            subject: err.message,
            body: `There was some problem fetching the information for: ${cn}. For more details, see the console.`,
          } );
          history.replace( '/' );
        } );
    }
    return () => abort = true;
  }, [ cn, history ] );

  function EmptyMessage () {
    return (
      <EmptyState>
        <EmptyStateIcon
          variant="container"
          component={Spinner}
        ></EmptyStateIcon>
        <Text>Loading...</Text>
      </EmptyState>
    );
  }

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Title size="2xl" headingLevel="h2">
              {group.name}
            </Title>
          </ToolbarItem>

          <ToolbarItem alignment={{ default: "alignRight" }}>
            <Button
              variant="secondary"
              component={Link}
              to={`/group/edit/${cn}`}
            >
              Edit Group
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Divider />

      {loading && <EmptyMessage />}

      {!loading && (
        <Page>
          <PageSection variant={PageSectionVariants.light}>
            <DescriptionList columnModifier={{ default: "2Col" }}>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  LDAP/Rover Common Name
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {group.ldapCommonName}
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTerm>Managed By</DescriptionListTerm>
                <DescriptionListDescription>
                  <ChipGroup>
                    <Chip isReadOnly>
                      <ion-icon name="person-circle-outline"></ion-icon> Group
                      Owner
                    </Chip>
                  </ChipGroup>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>

          <PageSection variant={PageSectionVariants.light}>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  Members <Badge isRead>{members.length}</Badge>
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <ChipGroup defaultIsOpen={true}>
                    {members.map((member) => (
                      <Chip isReadOnly key={member.uid}>
                        <ion-icon name="person-circle-outline"></ion-icon>{" "}
                        {member.cn}
                      </Chip>
                    ))}
                  </ChipGroup>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>

          <PageSection variant={PageSectionVariants.light}>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Managed Services:</DescriptionListTerm>
                <DescriptionListDescription>
                  <EmptyState variant="small">
                    <EmptyStateIcon
                      variant="container"
                      component={() => (
                        <ion-icon name="construct-outline"></ion-icon>
                      )}
                    ></EmptyStateIcon>
                    <EmptyStateBody>Under Development</EmptyStateBody>
                  </EmptyState>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>
        </Page>
      )}
    </>
  );
}

export default Group;
