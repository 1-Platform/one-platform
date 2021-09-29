import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
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
  ToolbarItem
} from '@patternfly/react-core'
import GroupsAPI from '../services/GroupsAPI'
import { BreadcrumbContext } from '../context/BreadcrumbContext'

function Group (props) {
  const { cn } = useParams()
  const history = useHistory()

  const [group, setGroup] = useState({
    _id: '',
    name: cn,
    cn: cn,
    createdOn: null,
    updatedOn: null
  })
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const { updateCrumbs } = useContext(BreadcrumbContext)

  useEffect(() => {
    updateCrumbs([
      { name: cn, href: window.location.href }
    ])

    return () => updateCrumbs([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cn])

  useEffect(() => {
    setLoading(true)
    let abort = false
    if (cn) {
      GroupsAPI.getGroupDetailsByCn(cn)
        .then(res => {
          if (abort) {
            return
          }
          if (!res) {
            throw new Error('Group not found')
          }
          setMembers(res.group.members)
          delete res.group.members
          setGroup(res.group)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          window.OpNotification && window.OpNotification.danger({
            subject: err.message,
            body: `There was some problem fetching the information for: ${cn}. For more details, see the console.`
          })
          history.replace('/')
        })
    }
    return () => abort = true
  }, [cn, history])

  function EmptyMessage () {
    return (
      <EmptyState>
        <EmptyStateIcon
          variant='container'
          component={Spinner}
        />
        <Text>Loading...</Text>
      </EmptyState>
    )
  }

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Title size='2xl' headingLevel='h2'>
              {group.name}
            </Title>
          </ToolbarItem>

          <ToolbarItem alignment={{ default: 'alignRight' }}>
            <Button
              variant='secondary'
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
            <DescriptionList columnModifier={{ default: '2Col' }}>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  LDAP/Rover Common Name
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {group.cn}
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTerm>Managed By</DescriptionListTerm>
                <DescriptionListDescription>
                  <ChipGroup>
                    <Chip isReadOnly>
                      <ion-icon name='person-circle-outline' /> Group
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
                  <ChipGroup defaultIsOpen>
                    {members.map((member) => (
                      <Chip isReadOnly key={member.uid}>
                        <ion-icon name='person-circle-outline' />{' '}
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
                  <EmptyState variant='small'>
                    <EmptyStateIcon
                      variant='container'
                      component={() => (
                        <ion-icon name='construct-outline' />
                      )}
                    />
                    <EmptyStateBody>Under Development</EmptyStateBody>
                  </EmptyState>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>
        </Page>
      )}
    </>
  )
}

export default Group
