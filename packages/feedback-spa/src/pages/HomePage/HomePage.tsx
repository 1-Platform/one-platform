import { CSSProperties, useCallback, useMemo, useState } from 'react';
import {
  Bullseye,
  Button,
  Checkbox,
  Divider,
  EmptyState,
  EmptyStateIcon,
  Grid,
  GridItem,
  Modal,
  ModalVariant,
  PageSection,
  Pagination,
  Radio,
  SearchInput,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { CubesIcon, PlusIcon, UploadIcon } from '@patternfly/react-icons';
import { useQuery } from 'urql';
import opcBase from '@one-platform/opc-base';
import * as jsonexport from 'jsonexport/dist';

import { useDebounce, usePagination, usePopUp, useQueryParams, useToggle } from 'hooks';
import { FeedbackCategoryAPI, FeedbackStatusAPI, FeedbackUserProfileAPI } from 'types';

import { GetApps } from './gql/GetApps';
import { GetFeedbackList } from './gql/GetFeedbackList';
import { FeedbackCard } from './components/FeedbackCard';
import { FeedbackDetailCard } from './components/FeedbackDetailCard';
import { AppListCard } from './components/AppListCard';
import { FilterTitle } from './components/FilterTitle';
import {
  FeedbackFilters,
  GetAppsQuery,
  App,
  GetFeedbackListQuery,
  GetFeedbackListQueryVariables,
  GetFeedbackById,
  Feedback,
} from './types';
import { GetFeedback } from './gql/GetFeedback';
import { EXPORT_FEEDBACK_CSV } from './homePage.helper';

export const HomePage = (): JSX.Element => {
  const query = useQueryParams();
  // modal state hooks
  const { popUp, handlePopUpOpen, handlePopUpClose } = usePopUp([
    { name: 'detailView', isOpen: Boolean(query.get('id')) },
    { name: 'appList', isOpen: false },
  ]);

  // hooks for api filtering, pagination
  const [filters, setFilters] = useState<FeedbackFilters>({
    selectedApps: null,
    status: null,
    category: null,
    search: '',
  });
  const { pagination, onPerPageSelect, onSetPage } = usePagination();
  const [isMyFeedback, setIsMyFeedback] = useToggle();
  const [isExporting, setIsExporting] = useToggle();

  const debouncedSearch = useDebounce(filters.search, 500);

  // convert the filters to graphl variable format for api calls
  const queryFilters = useMemo<GetFeedbackListQueryVariables>(() => {
    const appIds = Object.keys(filters.selectedApps || {});
    const userInfo = opcBase.auth?.getUserInfo();
    return {
      ...filters,
      search: debouncedSearch,
      appId: appIds.length !== 0 ? appIds : null,
      createdBy: isMyFeedback ? userInfo?.rhatUUID : null,
      limit: pagination.perPage,
      offset: (pagination.page - 1) * pagination.perPage,
    };
  }, [filters, debouncedSearch, isMyFeedback, pagination]);

  // Get app list
  const [{ data: appList, fetching: isAppListLoading }] = useQuery<GetAppsQuery>({
    query: GetApps,
  });

  /**
   * This query will be executed only when there is ?id=<feedback_id>
   * To fetch a particular feedback
   */
  const [{ data: feedbackById, fetching: isFeedbackByIdQueryLoading }] = useQuery<
    GetFeedbackById,
    { id: string }
  >({
    query: GetFeedback,
    variables: { id: query?.get('id') as string },
    pause: !query?.get('id'),
  });

  // Get feedback list
  const [{ data: fetchedFeedback, fetching: isFeedbackListLoading }] = useQuery<
    GetFeedbackListQuery,
    GetFeedbackListQueryVariables
  >({
    query: GetFeedbackList,
    variables: queryFilters,
  });

  const feedbacks = fetchedFeedback?.listFeedbacks;
  const selectedFeedback = (popUp?.detailView?.data as Feedback) || feedbackById?.getFeedbackById;

  // To keep all selectedApps sorted to top
  const selectedApps = useMemo(() => {
    if (!appList?.apps) return [];
    const apps = [...appList.apps];
    return apps
      .sort(({ id }) => (filters.selectedApps?.[id] ? -1 : 1)) // sort it with selected apps at top
      .slice(0, Math.max(Object.keys(filters.selectedApps || {}).length, 5)); // either show 5 apps or all the selected ones
  }, [appList?.apps, filters.selectedApps]);

  /**
   * To show the title of the ticket created
   * Computes it based on JIRA, Github, Gitlab
   */
  const formatePopupTitle = useCallback((type: string, url: string) => {
    if (!type || !url) {
      return '';
    }
    const splittedUrl = url.split('/');
    const ticketName = splittedUrl[splittedUrl.length - 1];
    if (type.toLowerCase() === 'jira') {
      return ticketName;
    }
    return `${type} ${ticketName}`;
  }, []);

  const handleFeedbackFilterChange = useCallback(
    <T extends unknown>(field: keyof FeedbackFilters, value: T) => {
      setFilters((state) => ({ ...state, [field]: value }));
    },
    []
  );

  const handleFeedbackFilterAppIdChange = useCallback(
    (app: App) => {
      const appsSelected = { ...filters.selectedApps };
      if (appsSelected?.[app.id]) {
        delete appsSelected[app.id];
      } else {
        appsSelected[app.id] = app;
      }
      setFilters((state) => ({ ...state, selectedApps: appsSelected }));
    },
    [filters.selectedApps]
  );

  const handleFeedbackFilterClear = useCallback((field: keyof FeedbackFilters) => {
    setFilters((state) => ({ ...state, [field]: null }));
  }, []);

  const onExportToCSV = () => {
    if (!feedbacks?.data) return;
    setIsExporting.on();
    /**
     * Format the feedback list json response for the csv
     * Set the headers and pick required fields only
     */
    const formatedFeedbacks = feedbacks?.data.map((feedback: Record<string, unknown>) => {
      const formatedFeedback: Record<string, unknown> = {};
      EXPORT_FEEDBACK_CSV.forEach(({ title, field }) => {
        const value = field.split('.').reduce((obj, i) => obj[i] as any, feedback);
        formatedFeedback[title] = value;
      });
      return formatedFeedback;
    });
    jsonexport(formatedFeedbacks, (err, csv) => {
      setIsExporting.off();
      if (err) {
        opcBase.toast.danger({ subject: 'Failed to export csv' });
      } else {
        // export to csv
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += csv;
        const encodedCsv = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedCsv);
        link.setAttribute('download', 'Feedback.csv');
        link.click();
        opcBase.toast.success({
          subject: 'Export sucessfully completed',
        });
      }
    });
  };

  return (
    <>
      <PageSection isWidthLimited variant="light" className=" pf-m-align-center">
        <Grid hasGutter style={{ '--pf-l-grid--m-gutter--GridGap': '2rem' } as CSSProperties}>
          <GridItem span={3}>
            <SearchInput
              type="search"
              id="search-feedback"
              placeholder="Search via name"
              value={filters.search || ''}
              onChange={(value) => handleFeedbackFilterChange('search', value)}
            />
          </GridItem>
          <GridItem span={9}>
            <Split>
              <SplitItem isFilled>
                <Button variant="primary" onClick={setIsMyFeedback.toggle}>
                  {`${isMyFeedback ? 'All' : 'My'} Feedback`}
                </Button>
              </SplitItem>
              <SplitItem>
                <Button
                  icon={<UploadIcon />}
                  variant="secondary"
                  onClick={onExportToCSV}
                  isLoading={isExporting}
                >
                  Export
                </Button>
              </SplitItem>
            </Split>
          </GridItem>
          <GridItem span={3}>
            <form>
              <Stack hasGutter>
                <StackItem>
                  <Stack hasGutter style={{ '--pf-global--gutter': '0.75rem' } as CSSProperties}>
                    <StackItem>
                      <FilterTitle
                        title="Applications"
                        onClear={() => handleFeedbackFilterClear('selectedApps')}
                        isClearable={Boolean(filters.selectedApps)}
                      />
                    </StackItem>
                    {isAppListLoading ? (
                      <Bullseye>
                        <Spinner size="lg" label="Loading..." />
                      </Bullseye>
                    ) : (
                      <>
                        {selectedApps.map((app) => (
                          <StackItem key={app.id}>
                            <Checkbox
                              id={app.id}
                              label={app.name}
                              className="capitalize"
                              isChecked={Boolean(filters.selectedApps?.[app.id])}
                              onChange={() => handleFeedbackFilterAppIdChange(app)}
                            />
                          </StackItem>
                        ))}
                        {(appList?.apps || [])?.length > 5 && (
                          <StackItem>
                            <Button
                              variant="link"
                              icon={<PlusIcon />}
                              onClick={() => handlePopUpOpen('appList')}
                            >
                              Expand to see more apps
                            </Button>
                          </StackItem>
                        )}
                      </>
                    )}
                  </Stack>
                </StackItem>
                <StackItem>
                  <Divider />
                </StackItem>
                <StackItem>
                  <Stack hasGutter style={{ '--pf-global--gutter': '0.75rem' } as CSSProperties}>
                    <StackItem>
                      <FilterTitle
                        title="Type"
                        onClear={() => handleFeedbackFilterClear('category')}
                        isClearable={Boolean(filters.category)}
                      />
                    </StackItem>
                    <StackItem>
                      <Radio
                        id="feedback-type-1"
                        label="Bug"
                        name="type"
                        isChecked={filters?.category === FeedbackCategoryAPI.BUG}
                        onChange={() =>
                          handleFeedbackFilterChange('category', FeedbackCategoryAPI.BUG)
                        }
                      />
                    </StackItem>
                    <StackItem>
                      <Radio
                        id="feedback-type-2"
                        label="Feedback"
                        name="type"
                        isChecked={filters?.category === FeedbackCategoryAPI.FEEDBACK}
                        onChange={() =>
                          handleFeedbackFilterChange('category', FeedbackCategoryAPI.FEEDBACK)
                        }
                      />
                    </StackItem>
                  </Stack>
                </StackItem>
                <StackItem>
                  <Divider />
                </StackItem>
                <StackItem>
                  <Stack hasGutter style={{ '--pf-global--gutter': '0.75rem' } as CSSProperties}>
                    <StackItem>
                      <FilterTitle
                        title="Status"
                        onClear={() => handleFeedbackFilterClear('status')}
                        isClearable={Boolean(filters.status)}
                      />
                    </StackItem>
                    <StackItem>
                      <Radio
                        id="feedback-status-1"
                        label="Open"
                        name="status"
                        isChecked={filters?.status === FeedbackStatusAPI.OPEN}
                        onChange={() =>
                          handleFeedbackFilterChange('status', FeedbackStatusAPI.OPEN)
                        }
                      />
                    </StackItem>
                    <StackItem>
                      <Radio
                        id="feedback-status-2"
                        label="Closed"
                        name="status"
                        isChecked={filters?.status === FeedbackStatusAPI.CLOSED}
                        onChange={() =>
                          handleFeedbackFilterChange('status', FeedbackStatusAPI.CLOSED)
                        }
                      />
                    </StackItem>
                  </Stack>
                </StackItem>
                <StackItem>
                  <Divider />
                </StackItem>
              </Stack>
            </form>
          </GridItem>
          <GridItem span={9}>
            <Stack hasGutter>
              {isFeedbackListLoading || feedbacks?.count === 0 ? (
                <EmptyState>
                  <EmptyStateIcon
                    variant={isFeedbackListLoading ? 'container' : 'icon'}
                    component={isFeedbackListLoading ? Spinner : undefined}
                    icon={CubesIcon}
                  />
                  <Title size="lg" headingLevel="h4">
                    {isFeedbackListLoading ? 'Loading' : 'No feedback found!!'}
                  </Title>
                </EmptyState>
              ) : (
                feedbacks?.data?.map((feedback) => (
                  <StackItem key={feedback.id}>
                    <FeedbackCard
                      title={(feedback.createdBy as FeedbackUserProfileAPI)?.cn}
                      createdOn={feedback.createdOn}
                      description={feedback.summary}
                      experience={feedback.experience}
                      module={feedback.module}
                      category={feedback.category}
                      state={feedback.state}
                      onClick={() => handlePopUpOpen('detailView', feedback)}
                    />
                  </StackItem>
                ))
              )}
              <StackItem>
                <Pagination
                  itemCount={feedbacks?.count}
                  isCompact
                  perPage={pagination.perPage}
                  page={pagination.page}
                  onSetPage={(_evt, newPage) => onSetPage(newPage)}
                  widgetId="feedback-pagination"
                  onPerPageSelect={(_evt, perPage) => onPerPageSelect(perPage)}
                />
              </StackItem>
            </Stack>
          </GridItem>
        </Grid>
      </PageSection>
      <Modal
        variant={ModalVariant.small}
        title={formatePopupTitle(selectedFeedback?.source, selectedFeedback?.ticketUrl)}
        isOpen={popUp.detailView.isOpen}
        onClose={() => handlePopUpClose('detailView')}
        footer={
          <Split hasGutter style={{ width: '100%' }}>
            <SplitItem isFilled>
              <a href={selectedFeedback?.ticketUrl} target="_blank" rel="noopener noreferrer">
                <Button isSmall key="more" variant="danger">
                  See {selectedFeedback?.source} Issue
                </Button>
              </a>
            </SplitItem>
            <SplitItem>
              <Button
                key="close"
                variant="tertiary"
                isSmall
                onClick={() => handlePopUpClose('detailView')}
              >
                Close
              </Button>
            </SplitItem>
          </Split>
        }
      >
        <FeedbackDetailCard feedback={selectedFeedback} isLoading={isFeedbackByIdQueryLoading} />
      </Modal>
      <Modal
        variant={ModalVariant.medium}
        title="All Applications"
        isOpen={popUp.appList.isOpen}
        onClose={() => handlePopUpClose('appList')}
      >
        <AppListCard
          apps={appList?.apps}
          filteredApps={filters.selectedApps}
          onSubmit={(apps) => {
            setFilters((state) => ({ ...state, selectedApps: apps }));
            handlePopUpClose('appList');
          }}
        />
      </Modal>
    </>
  );
};
