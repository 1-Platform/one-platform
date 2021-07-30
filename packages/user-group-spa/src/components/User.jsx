import React, { useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionToggle,
  Chip,
  ChipGroup,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Page,
  PageSection,
  PageSectionVariants,
  Spinner,
  Text,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { useEffect } from 'react';
import { BreadcrumbContext } from '../context/BreadcrumbContext';

function User ( props ) {
  const { cn } = useParams()

  const [ loading, setLoading ] = useState( true );
  const [ user, setUser ] = useState( { name: cn } );
  const [ authRolesExpanded, setAuthRolesExpanded ] = useState( false );
  const history = useHistory();

  const { updateCrumbs } = useContext( BreadcrumbContext );

  useEffect( () => {
    updateCrumbs( [
      { name: 'Users', href: '#' },
      { name: cn, href: window.location.href }
    ] );

    return () => updateCrumbs( [] );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ cn ] );

  useEffect( () => {
    setLoading( true );
    const authUser = window.OpAuthHelper?.getUserInfo();
    if ( authUser?.kerberosID === cn ) {
      setUser( {
        name: authUser.fullName,
        email: authUser.email,
        uid: authUser.kerberosID,
        title: authUser.title,
        roles: authUser.roles,
      } );
    } else {
      window.OpNotification && window.OpNotification.warning( {
        subject: `Insufficient permissions to view the details for: ${ cn }`
      } );
      history.replace( `/user/${ authUser.kerberosID }` );
    }
    setLoading( false );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ cn ] );

  function EmptyMessage() {
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
              {user.name}
            </Title>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Divider />

      {loading && <EmptyMessage />}

      {!loading && (
        <Page>
          <PageSection variant={PageSectionVariants.light}>
            <DescriptionList columnModifier={{ default: "3Col" }}>
              <DescriptionListGroup>
                <DescriptionListTerm>Title</DescriptionListTerm>
                <DescriptionListDescription>
                  {user.title}
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTerm>Email</DescriptionListTerm>
                <DescriptionListDescription>
                  {user.email}
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTerm>Kerberos ID</DescriptionListTerm>
                <DescriptionListDescription>
                  {user.uid}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>

          <PageSection variant={PageSectionVariants.light}>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Rover Groups</DescriptionListTerm>
                <DescriptionListDescription>
                  { user.roles?.length > 0 && (
                    <ChipGroup>
                      { user.roles.map( ( role ) => (
                        <Chip key={ role } isReadOnly>
                          { role }
                        </Chip>
                      ) ) }
                    </ChipGroup>
                  ) }
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>

          <PageSection variant={PageSectionVariants.light}>
            <Accordion>
              <AccordionToggle
                id="authRoles"
                onClick={() => setAuthRolesExpanded(!authRolesExpanded)}
                isExpanded={ authRolesExpanded }
              >
                <Title size="xl" headingLevel="h4">
                  Authorization &amp; API Permissions
                </Title>
              </AccordionToggle>
              <AccordionContent isHidden={!authRolesExpanded}>
                <EmptyState>
                  <EmptyStateIcon
                    variant="container"
                    component={() => (
                      <ion-icon name="construct-outline"></ion-icon>
                    )}
                  ></EmptyStateIcon>
                  <EmptyStateBody>Under Development</EmptyStateBody>
                </EmptyState>
              </AccordionContent>
            </Accordion>
          </PageSection>
        </Page>
      )}
    </>
  );
}

export default User;
