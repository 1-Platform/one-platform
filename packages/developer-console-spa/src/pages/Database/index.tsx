import {
  Card,
  CardBody,
  StackItem,
  Button,
  FlexItem,
  Flex,
  SearchInput,
  Gallery,
  GalleryItem,
  CardHeader,
  CardActions,
  CardTitle,
  Modal,
  DropdownItem,
  Dropdown,
  KebabToggle,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ProjectContext } from 'common/context/ProjectContext';
import { ReactComponent as StorageIcon } from 'assets/storage_black_24dp.svg';
import CreateDBForm from './CreateDBForm';
import Loader from '../../common/components/Loader';
import {
  Link,
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import UpdateCouchDBConfig from './UpdateDBConfig';
import { HeaderContext } from 'common/context/HeaderContext';

export default function Database() {
  const { projectId, project, loading: appLoading } = useContext(ProjectContext);
  const { setHeader } = useContext(HeaderContext);
  const [isCreateDBFormOpen, setIsCreateDBFormOpen] = useState(false);
  const [expandedMenuCardId, setExpandedMenuCardId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  let { url } = useRouteMatch();
  const onCardMenuSelect = () => {
    setExpandedMenuCardId('');
  };
  const onCardMenuToggle = useCallback((id: string) => {
    setExpandedMenuCardId(id === expandedMenuCardId ? '' : id);
  }, [expandedMenuCardId]);

  useEffect(() => {
    setHeader([
      { title: 'Database', path: `/${projectId}/database` },
    ]);

    return () => setHeader([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const dropdownItems = useCallback(( db: any ) => {
    const truncatedUrl = ( url.endsWith('/') ) ? url.substring(0, url.length - 1) : url;

    return [
      <Link to={`${truncatedUrl}/${db.name}`} key={db.name}>
        <DropdownItem component="span">
          Configure
        </DropdownItem>
      </Link>
    ];
  }, [url]);

  /**
   * Escapes the string for special characters
   */
  const escapeString = (string: string) => {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  const filteredDBs = useMemo( () => {
    return project.database?.databases.filter( ( db ) =>
      db.name.includes( escapeString( searchTerm.trim() ) )
    )
  }, [project.database?.databases, searchTerm]);

  const openCreateDBForm = useCallback(() => {
    setIsCreateDBFormOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsCreateDBFormOpen(false);
  }, []);

  const getEmptyState = useCallback(() => {
    const noSearchResults = searchTerm && filteredDBs?.length === 0;
    return (
      <Card>
        <CardBody className="couch-db--emptyStateBody">
          <EmptyState>
            <EmptyStateIcon icon={StorageIcon} />
            <EmptyStateBody>
              {noSearchResults ? (
                'No search results for the criteria.'
              ) : (
                <p>
                  Looks like you don't have any databases created. <br />
                  To create a database click on Create Database button.
                </p>
              )}
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }, [filteredDBs, searchTerm]);

  return (
    <>
      {appLoading ? (
        <Loader />
      ) : (
        <Switch>
          <Route exact path={`${url}/`}>
            <>
              <StackItem>
                <Flex
                  justifyContent={{ default: 'justifyContentSpaceBetween' }}
                >
                  <FlexItem>
                    <Button onClick={openCreateDBForm}>
                      Create Database
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <SearchInput
                      isDisabled={project.database?.databases?.length === 0}
                      value={searchTerm}
                      onChange={(value: string) => setSearchTerm(value)}
                      placeholder={'Search'}
                    />
                  </FlexItem>
                </Flex>
              </StackItem>
              <StackItem>
                {project.database?.databases?.length === 0 ||
                filteredDBs.length === 0 ? (
                  getEmptyState()
                ) : (
                  <Gallery
                    className="lighthouse-projectForm--marginTop"
                    hasGutter
                    minWidths={{
                      md: '100px',
                      lg: '150px',
                      xl: '200px',
                      '2xl': '300px',
                    }}
                  >
                    {filteredDBs.map((db) => {
                      return (
                        <GalleryItem key={db.name}>
                          <Card className="couch-db--card">
                            <CardHeader>
                              <CardActions>
                                <Dropdown
                                  onSelect={onCardMenuSelect}
                                  toggle={
                                    <KebabToggle
                                      onToggle={() => {
                                        onCardMenuToggle(db.name);
                                      }}
                                    />
                                  }
                                  isOpen={expandedMenuCardId === db.name}
                                  isPlain
                                  dropdownItems={dropdownItems(db)}
                                  position={'right'}
                                />
                              </CardActions>
                              <CardTitle>{db.name}</CardTitle>
                            </CardHeader>
                            <CardBody>
                              {db.description || 'No description'}
                            </CardBody>
                          </Card>
                        </GalleryItem>
                      );
                    })}
                  </Gallery>
                )}
              </StackItem>
            </>
          </Route>
          <Route path={`${url}/:dbname`}>
            <UpdateCouchDBConfig />
          </Route>
        </Switch>
      )}

      {isCreateDBFormOpen && (
        <Modal
          variant="small"
          title="Create new Database"
          isOpen={isCreateDBFormOpen}
          onClose={handleModalClose}
          showClose={true}
        >
          <CreateDBForm
            setIsCreateDBFormOpen={setIsCreateDBFormOpen}
            projectId={project.projectId}
          />
        </Modal>
      )}
    </>
  );
}
