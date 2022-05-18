import { useMemo, useState } from 'react';
import {
  Bullseye,
  Button,
  Divider,
  Label,
  Menu,
  MenuItem,
  MenuList,
  PageSection,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { Link, useNavigate } from 'react-router-dom';
import { ApiCatalogLinks } from 'router/links';
import { useDebounce } from 'hooks';
import { config } from 'config';
import { ApiCategory } from 'api/types';

import { useGetNamespaceList } from './hooks';
import { SearchBar } from './components/SearchBar';
import styles from './homePage.module.scss';

const OP_CONTAINER_LOGO = `${config.baseURL}/images/op-containers.svg`;

const GRAPHQL_LOGO = `${config.baseURL}/images/graphql-logo.svg`;
const REST_LOGO = `${config.baseURL}/images/rest-logo.svg`;

const HomePage = (): JSX.Element => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search);
  const { isLoading, data: namespace } = useGetNamespaceList({ search: debouncedSearch });

  const onSearchChange = (value: string): void => {
    setSearch(value);
  };

  const onSearch = () => {
    navigate(`/apis?search=${search}`);
  };

  // memorized function to render the async search results
  const searchResult = useMemo(() => {
    const results = namespace?.listNamespaces?.data;

    if (isLoading) {
      return (
        <MenuItem key="search-menu">
          Searching <Spinner size="sm" />
        </MenuItem>
      );
    }

    if (!results?.length) {
      return [
        <MenuItem key="search-menu-no-result" isDisabled>
          No results were found
        </MenuItem>,
        <MenuItem onClick={onSearch} itemId="loader" key="search-menu-view-more">
          View more
        </MenuItem>,
      ];
    }

    return results?.map(({ name, id, schemas, slug }, index) => [
      <Link to={`/apis/${slug}`} className="catalog-nav-link" key={`${id}-${index + 1}`}>
        <MenuItem
          description={
            <Split className="pf-u-mt-xs">
              <SplitItem className="pf-u-mr-xs">
                <Text component={TextVariants.small} className="pf-u-color-200">
                  Schema(s):
                </Text>
              </SplitItem>
              {schemas.map(({ name: sName, id: sId, category }) => (
                <SplitItem key={sId} className="pf-u-mr-xs">
                  <Label
                    isCompact
                    color="blue"
                    icon={
                      <img
                        src={category === ApiCategory.GRAPHQL ? GRAPHQL_LOGO : REST_LOGO}
                        width="12px"
                        alt="graphql rest"
                        className="pf-u-mt-xs"
                      />
                    }
                  >
                    <Text component={TextVariants.small} className="pf-u-color-200">
                      {sName}
                    </Text>
                  </Label>
                </SplitItem>
              ))}
            </Split>
          }
        >
          {name}
        </MenuItem>
      </Link>,
      index !== (results?.length || 0) - 1 && <Divider key={`${id}-${index + 2}`} />,
      index === (results?.length || 1) - 1 && (
        <MenuItem onClick={onSearch} itemId="loader" key="search-menu-view-more">
          View more
        </MenuItem>
      ),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace?.listNamespaces, isLoading]);

  return (
    <>
      <PageSection className={css(styles.header, 'pf-m-align-center')} isWidthLimited>
        <Stack className="pf-u-p-xl pf-u-pt-3xl" hasGutter>
          <StackItem>
            <Split>
              <SplitItem isFilled>
                <Stack style={{ maxWidth: '620px' }}>
                  <StackItem className="pf-u-mb-md">
                    <Title headingLevel="h1" size="4xl">
                      API Catalog
                    </Title>
                  </StackItem>
                  <StackItem>
                    <Text className="pf-u-font-size-xl">
                      A catalog of APIs to manage, promote and share APIs with developers and users.
                    </Text>
                  </StackItem>
                  <StackItem>
                    <Link to={ApiCatalogLinks.ListPage}>
                      <Button variant="primary" isBlock className={styles['header-explore-button']}>
                        <Split className="pf-u-align-items-center">
                          <SplitItem>Discover a wide list of APIs</SplitItem>
                          <SplitItem isFilled />
                          <SplitItem>Explore</SplitItem>
                          <SplitItem className="pf-u-ml-sm">
                            <ArrowRightIcon size="sm" />
                          </SplitItem>
                        </Split>
                      </Button>
                    </Link>
                  </StackItem>
                </Stack>
              </SplitItem>
              <SplitItem>
                <Bullseye>
                  <img src={OP_CONTAINER_LOGO} alt="api catalog" width="160cm" />
                </Bullseye>
              </SplitItem>
            </Split>
          </StackItem>
          <StackItem className="pf-u-mt-2xl">
            <Bullseye className={styles['catalog-search-container']}>
              <div className="pf-u-w-75">
                <SearchBar placeholder="Search for APIs" value={search} onChange={onSearchChange} />
              </div>
              {search && debouncedSearch && (
                <Menu className={styles['catalog-search-menu']}>
                  <MenuList>{searchResult}</MenuList>
                </Menu>
              )}
            </Bullseye>
          </StackItem>
        </Stack>
      </PageSection>
      <PageSection
        isWidthLimited
        className={css('pf-m-align-center', styles['add-api-section--container'])}
        variant="dark"
      >
        <Bullseye className="pf-u-px-xl">
          <Split className={css(styles['add-api-section'], 'pf-u-w-100 pf-u-px-4xl pf-u-py-xl')}>
            <SplitItem isFilled>
              <Text component={TextVariants.small}>ADD DATASOURCE</Text>
              <Text className="pf-u-font-size-2xl">Want to add an API to the Catalog?</Text>
            </SplitItem>
            <SplitItem className="pf-l-flex pf-m-align-items-center">
              <Link to={ApiCatalogLinks.AddNewApiPage}>
                <Button variant="secondary">Add API</Button>
              </Link>
            </SplitItem>
          </Split>
        </Bullseye>
      </PageSection>
    </>
  );
};

export default HomePage;
