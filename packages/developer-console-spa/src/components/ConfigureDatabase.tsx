import {
  Card,
  CardBody,
  Stack,
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
  CardFooter,
  Modal,
  DropdownItem,
  Dropdown,
  KebabToggle,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import { useCallback, useContext, useMemo, useState } from 'react';
import { AppContext } from '../context/AppContext';
import CreateDBForm from './database/CreateDBForm';
import Header from './Header';
import Loader from './Loader';
import { ReactComponent as StorageIcon } from '../assets/storage_black_24dp.svg';
import {
  Link,
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import UpdateCouchDBConfig from './database/UpdateDBConfig';

function ConfigureCouchDB() {
  const { app, loading: appLoading } = useContext(AppContext);
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

  const dropdownItems = useCallback(( db: any ) => {
    if ( url.endsWith('/') ) {
      url = url.substring(0, url.length - 1);
    }
    return [
      <Link to={`${url}/${db.name}`} key={db.name}>
        <DropdownItem component="span">
          Configure
        </DropdownItem>
      </Link>
    ];
  }, []);

  /**
   * Escapes the string for special characters
   */
  const escapeString = (string: string) => {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  const filteredDBs = useMemo( () => {
    return app.database?.databases.filter( ( db ) =>
      db.name.includes( escapeString( searchTerm.trim() ) )
    )
  }, [app.database?.databases, searchTerm]);

  const openCreateDBForm = useCallback(() => {
    setIsCreateDBFormOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsCreateDBFormOpen(false);
  }, []);

  /**
   *
   * @param name This function will be uncommented once we have Fauxton UI is available

  const openFauxtonGUI = (name: string) => {
    window.open(`${process.env.REACT_APP_FAUXTON_URL}/${name}/_all_docs`, '_blank' );
  }*/

  const getEmptyState = useCallback(() => {
    const noSearchResults = searchTerm && filteredDBs.length === 0;
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
  }, [filteredDBs.length, searchTerm]);

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Header title="Configure Database" />
        </StackItem>

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
                        isDisabled={app.database?.databases?.length === 0}
                        value={searchTerm}
                        onChange={(value: string) => setSearchTerm(value)}
                        placeholder={'Search'}
                      />
                    </FlexItem>
                  </Flex>
                </StackItem>
                <StackItem>
                  {app.database?.databases?.length === 0 ||
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
                              <CardFooter>
                                <Button
                                  variant="link"
                                  icon={
                                    <ion-icon name="open-outline"></ion-icon>
                                  }
                                  iconPosition="right"
                                >
                                  Open Fauxton GUI
                                </Button>
                              </CardFooter>
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
      </Stack>
      {isCreateDBFormOpen && (
        <Modal
          variant="small"
          title="Create new Database"
          isOpen={isCreateDBFormOpen}
          onClose={handleModalClose}
          showClose={true}
        >
          <CreateDBForm
            isCreateDBFormOpen={isCreateDBFormOpen}
            setIsCreateDBFormOpen={setIsCreateDBFormOpen}
            appUniqueId={app.id}
            appId={app.appId}
          />
        </Modal>
      )}
    </>
  );
}

export default ConfigureCouchDB;
