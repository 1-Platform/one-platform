import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bullseye,
  Button,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Form,
  FormGroup,
  Grid,
  GridItem,
  PageSection,
  Pagination,
  Select,
  SelectOption,
  SelectOptionObject,
  Spinner,
  Split,
  SplitItem,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useDebounce, usePagination, useQueryParams, useToggle } from 'hooks';
import { ApiCatalogLinks } from 'router';

import { callbackify } from 'utils';
import { ApiCategory, ApiEmailGroup, ApiOwnerType } from 'graphql/namespace/types';
import { useGetNamespaceList } from './hooks/useGetNamespaceList';
import { useGetNamespaceStats } from './hooks/useGetNamespaceStats';

import { Header } from './components/Header';
import { ApiDetailsCard } from './components/ApiDetailsCard';
import { StatCard } from './components/StatCard';
import styles from './apiListPage.module.scss';
import { stats } from './apiListPage.helper';
import { SortBy } from './types';

export const APIListPage = (): JSX.Element => {
  const navigate = useNavigate();

  // query param strings
  const query = useQueryParams();
  const mid = query.get('mid');
  const defaultSearch = query.get('search');

  // filters, search, sorting
  const [isSortSelectOpen, setSortSelect] = useToggle();
  const [sortOption, setSortOption] = useState(SortBy.RECENTLY_ADDED);
  const [filters, setFilters] = useState<{ type: null | ApiCategory; search: string }>({
    type: null,
    search: defaultSearch || '',
  });
  const { pagination, onPerPageSelect, onSetPage, onResetPagination } = usePagination({
    page: 1,
    perPage: 20,
  });
  const debouncedSearch = useDebounce(filters.search);

  // graphql query hooks
  const { isLoading: isApiListLoading, data: namespaceList } = useGetNamespaceList({
    limit: pagination.perPage,
    offset: (pagination.page - 1) * pagination.perPage,
    apiCategory: filters.type,
    search: debouncedSearch,
    sortBy: sortOption === SortBy.RECENTLY_ADDED ? 'CREATED_AT' : 'UPDATED_AT',
    mid,
  });
  const { isLoading: isNamespaceStatLoading, data: namespaceStats } = useGetNamespaceStats({
    search: debouncedSearch,
    mid,
  });

  const handleApiOwnersRender = useCallback((owners: ApiOwnerType[]) => {
    return owners
      .map((owner) => (owner.group === ApiEmailGroup.USER ? owner.user.cn : owner.email))
      .join(', ');
  }, []);

  const onStatCardClick = (cardType: 'all' | 'rest' | 'graphql') => {
    onResetPagination();
    if (cardType === 'all') {
      setFilters((state) => ({ ...state, type: null }));
    } else {
      setFilters((state) => ({ ...state, type: cardType.toUpperCase() as ApiCategory }));
    }
  };

  const onSearch = (search: string) => {
    setFilters((state) => ({ ...state, search }));
  };

  const onSortSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => {
    if (isPlaceholder) setSortOption(SortBy.RECENTLY_ADDED);
    else setSortOption(value as SortBy);

    setSortSelect.off(); // close the select
  };

  const onCardClick = (id: string) => {
    navigate(id);
  };

  const onClickStopPropagation: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.stopPropagation();
  };

  const namespaceCount = namespaceStats?.getNamespaceCount;
  const namespaces = namespaceList?.listNamespaces?.data;

  const isNamespaceEmpty = !isApiListLoading && namespaces?.length === 0;

  return (
    <>
      <Header />
      <Divider />
      <PageSection variant="light" isWidthLimited className="pf-m-align-center">
        <Grid hasGutter>
          <Grid hasGutter span={12}>
            {stats.map(({ key, type, image }) => (
              <GridItem
                key={`api-select-${type}`}
                span={4}
                className={styles['api-list--stat-card']}
                type={key}
              >
                <StatCard
                  value={namespaceCount?.[key]}
                  category={type}
                  isLoading={isNamespaceStatLoading}
                  onClick={callbackify(onStatCardClick, key)}
                  isSelected={filters.type ? filters.type.toLowerCase() === key : key === 'all'}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/${image}`}
                    alt={`api-select-${type}`}
                    style={{ height: '48px' }}
                  />
                </StatCard>
              </GridItem>
            ))}
          </Grid>
          <GridItem className="pf-u-my-md">
            <Split hasGutter className={styles['api-list--table-filter--container']}>
              <SplitItem isFilled>
                <Link to={ApiCatalogLinks.AddNewApiPage}>
                  <Button>Add API</Button>
                </Link>
              </SplitItem>
              <SplitItem className="pf-u-w-33">
                <Form>
                  <FormGroup fieldId="search">
                    <TextInput
                      aria-label="Search API"
                      placeholder="Search for APIs"
                      type="search"
                      iconVariant="search"
                      value={filters.search}
                      onChange={onSearch}
                    />
                  </FormGroup>
                </Form>
              </SplitItem>
              <SplitItem style={{ width: '180px' }}>
                <Select
                  isOpen={isSortSelectOpen}
                  onToggle={setSortSelect.toggle}
                  selections={sortOption}
                  onSelect={onSortSelect}
                >
                  {[
                    <SelectOption key="select-sort-placeholder" value="Sort by" isDisabled />,
                    <SelectOption
                      key={`select-sort:${SortBy.RECENTLY_ADDED}`}
                      value={SortBy.RECENTLY_ADDED}
                    />,
                    <SelectOption
                      key={`select-sort:${SortBy.RECENTLY_MODIFIED}`}
                      value={SortBy.RECENTLY_MODIFIED}
                    />,
                  ]}
                </Select>
              </SplitItem>
            </Split>
          </GridItem>

          {isApiListLoading ? (
            <Bullseye className="pf-u-mt-lg">
              <Spinner size="xl" />
            </Bullseye>
          ) : (
            namespaces?.map(({ id, name, appUrl, updatedOn, category, owners }) => (
              <GridItem
                span={12}
                key={id}
                className="catalog-nav-link"
                onClick={callbackify(onCardClick, id)}
              >
                <ApiDetailsCard
                  title={name}
                  ownedBy={handleApiOwnersRender(owners)}
                  appUrl={appUrl}
                  updatedAt={updatedOn}
                  apiType={category}
                >
                  {category === ApiCategory.GRAPHQL ? (
                    [
                      <Link
                        to={`/apis/graphql/voyager/${id}`}
                        key={`${id}-voyager-btn`}
                        onClick={onClickStopPropagation}
                      >
                        <Button variant="secondary" isSmall>
                          Try voyager
                        </Button>
                      </Link>,
                      <Link
                        to={`/apis/graphql/playground/${id}`}
                        key={`${id}-playground-btn`}
                        onClick={onClickStopPropagation}
                      >
                        <Button variant="secondary" isSmall key={`${id}-playground-btn`}>
                          Try playground
                        </Button>
                      </Link>,
                    ]
                  ) : (
                    <Link
                      to={`/apis/rest/swagger/${id}`}
                      key={`${id}-swagger-btn`}
                      onClick={onClickStopPropagation}
                    >
                      <Button variant="secondary" isSmall key={`${id}-rest-btn`}>
                        Try swagger
                      </Button>
                    </Link>
                  )}
                </ApiDetailsCard>
              </GridItem>
            ))
          )}
          {isNamespaceEmpty && (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No API found
              </Title>
              <EmptyStateBody>Add an API to fill this gap</EmptyStateBody>
            </EmptyState>
          )}
        </Grid>
      </PageSection>
      <PageSection variant="light" isWidthLimited className="pf-m-align-center pf-u-pb-2xl">
        <Pagination
          itemCount={namespaceList?.listNamespaces?.count || 0}
          widgetId="pagination-options-menu-bottom"
          perPage={pagination.perPage}
          page={pagination.page}
          onSetPage={(_, page) => onSetPage(page)}
          onPerPageSelect={(_, perPage) => onPerPageSelect(perPage)}
          isCompact
        />
      </PageSection>
    </>
  );
};
