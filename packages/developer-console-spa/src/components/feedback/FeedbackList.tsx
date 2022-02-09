import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Label,
  Pagination,
  SearchInput,
  Select,
  SelectOption,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useToggle } from 'hooks/useToggle';
import { usePagination } from 'hooks/usePagination';
import { useDebounce } from 'hooks/useDebounce';
import { AppContext } from 'context/AppContext';
import { getAppFeedbacksService } from 'services/feedback';

const FEEDBACK_TABLE_TITLES = ['Created by', 'Summary', 'Type', 'Experience'];

type FeedbackState = {
  count: number;
  data: Partial<FeedbackType>[];
  isLoading?: boolean;
};

const SORT_SELECT_OPTIONS = [
  {
    value: 'CREATED_ON',
    toString: () => 'Sort by: newest',
  },
  {
    value: 'UPDATED_ON',
    toString: () => 'Sort by: activity',
  },
];

export const FeedbackList = () => {
  const [isSortOpen, setIsSortOpen] = useToggle();
  const { loading: appLoading, app } = useContext(AppContext);
  const { pagination, onPerPageSelect, onSetPage } = usePagination();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(SORT_SELECT_OPTIONS[0]);

  const debouncedSearchTerm = useDebounce(
    search,
    500,
    useCallback(() => {
      onSetPage(1);
    }, [onSetPage])
  );

  const [feedbacks, setFeedbacks] = useState<FeedbackState>({
    count: 0,
    isLoading: true,
    data: [],
  });

  useEffect(() => {
    if (!appLoading) {
      setFeedbacks((state) => ({ ...state, isLoading: true }));
      getAppFeedbacksService(app.id, {
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
        search: debouncedSearchTerm,
        sortBy: sortBy.value,
      })
        .then((data) => {
          setFeedbacks((state) => ({ ...state, ...data }));
        })
        .catch((err) => {
          window.OpNotification({
            subject: `Failed to fetch feedbacks`,
            body: err?.message,
          });
        })
        .finally(() =>
          setFeedbacks((state) => ({ ...state, isLoading: false }))
        );
    }
  }, [
    appLoading,
    app.id,
    pagination.perPage,
    pagination.page,
    debouncedSearchTerm,
    sortBy,
  ]);

  const handleFeedbackSearchChange = (value: string) => {
    setSearch(value);
  };

  const truncateText = useCallback(
    (text: string) => (text.length > 200 ? text.slice(0, 200) + '...' : text),
    []
  );

  const handleFeedbackSortChange = (
    _evt: React.MouseEvent | React.ChangeEvent,
    selection: any
  ) => {
    setSortBy(selection);
    setIsSortOpen.off();
  };

  return (
    <Card>
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h3">User Feedback</Title>
          </StackItem>
          <StackItem>
            <Split hasGutter>
              <SplitItem isFilled>
                <SearchInput
                  placeholder="Search by summary"
                  style={{ maxWidth: '320px' }}
                  onChange={handleFeedbackSearchChange}
                />
              </SplitItem>
              <SplitItem>
                <Link to="feedback/edit">
                  <Button variant="primary">Edit Feedback Config</Button>
                </Link>
              </SplitItem>
              <SplitItem>
                <Select
                  isOpen={isSortOpen}
                  onToggle={setIsSortOpen.toggle}
                  onSelect={handleFeedbackSortChange}
                  selections={sortBy}
                >
                  {SORT_SELECT_OPTIONS.map((value, index) => (
                    <SelectOption
                      key={`feedback-sort-${index}`}
                      value={value}
                    />
                  ))}
                </Select>
              </SplitItem>
            </Split>
          </StackItem>
          <StackItem>
            <TableComposable aria-label="Feedback" variant="compact">
              <Thead>
                <Tr>
                  {FEEDBACK_TABLE_TITLES.map((title, columnIndex) => (
                    <Th key={`$feedback-head-${columnIndex}`}>{title}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {feedbacks.isLoading ? (
                  <Tr>
                    <Td colSpan={8}>
                      <Bullseye>
                        <EmptyState>
                          <EmptyStateIcon
                            variant="container"
                            component={Spinner}
                          />
                          <Title size="lg" headingLevel="h4">
                            Loading
                          </Title>
                        </EmptyState>
                      </Bullseye>
                    </Td>
                  </Tr>
                ) : (
                  <>
                    {feedbacks.data.length === 0 && (
                      <Tr>
                        <Td colSpan={8}>
                          <Bullseye>
                            <EmptyState variant={EmptyStateVariant.small}>
                              <EmptyStateIcon icon={SearchIcon} />
                              <Title headingLevel="h2" size="lg">
                                No results found
                              </Title>
                            </EmptyState>
                          </Bullseye>
                        </Td>
                      </Tr>
                    )}
                    {feedbacks.data.map(
                      (
                        { summary, createdBy, category, experience, error, id },
                        rowIndex
                      ) => {
                        const isEvenRow = rowIndex % 2;
                        const isError = Boolean(error);
                        const isBug = category === 'BUG';
                        return (
                          <Tr
                            key={`feedback-rows-${rowIndex}`}
                            style={
                              isEvenRow
                                ? { backgroundColor: '#FAFAFA' }
                                : undefined
                            }
                          >
                            <Td>{(createdBy as FeedbackUserProfile)?.cn}</Td>
                            <Td>{truncateText(summary || '')}</Td>
                            <Td>
                              <Label color={isBug ? 'red' : 'blue'}>
                                {category}
                              </Label>
                            </Td>
                            <Td>
                              <Label color={isError ? 'red' : 'blue'}>
                                {isError ? error : experience}
                              </Label>
                            </Td>
                            <Td style={{ textAlign: 'right' }}>
                              <a
                                href={`/feedback/?id=${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant="link"
                                  icon={
                                    <ExternalLinkAltIcon
                                      width="12px"
                                      height="12px"
                                    />
                                  }
                                  iconPosition="right"
                                >
                                  View
                                </Button>
                              </a>
                            </Td>
                          </Tr>
                        );
                      }
                    )}
                  </>
                )}
              </Tbody>
            </TableComposable>
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
      </CardBody>
    </Card>
  );
};

export default FeedbackList;
