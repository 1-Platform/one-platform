import {
  Divider,
  EmptyState,
  EmptyStateIcon,
  Label,
  List,
  ListItem,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { FeedbackCategoryAPI, FeedbackUserProfileAPI } from 'types';
import { Feedback } from '../../types';

interface Props {
  feedback?: Feedback;
  isLoading?: boolean;
}

export const FeedbackDetailCard = ({ feedback, isLoading }: Props): JSX.Element => {
  const formatDate = useCallback((date: string) => {
    return dayjs(date).format('DD MMMM YYYY');
  }, []);

  if (!feedback || isLoading) {
    return (
      <EmptyState>
        <EmptyStateIcon
          variant={isLoading ? 'container' : 'icon'}
          component={isLoading ? Spinner : undefined}
          icon={CubesIcon}
        />
        <Title size="lg" headingLevel="h4">
          {isLoading ? 'Loading' : 'No feedback found!!!'}
        </Title>
      </EmptyState>
    );
  }

  const {
    createdBy,
    createdOn,
    summary,
    description,
    error,
    experience,
    state,
    module,
    category,
    assignee,
  } = feedback;

  return (
    <Stack>
      <StackItem>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h6">
              {(createdBy as FeedbackUserProfileAPI)?.cn} at {formatDate(createdOn)}
            </Title>
            {summary}.
          </StackItem>
          <StackItem style={{ whiteSpace: 'pre-line', lineHeight: 1.75 }}>
            <Title headingLevel="h6">Description</Title>
            {/* // regex in html to remove <br/> tag */}
            {description.replace(/<br\/>/gi, '')}
          </StackItem>
          <StackItem>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h6">Details</Title>
                <Divider />
              </StackItem>
              <StackItem>
                <List isPlain isBordered>
                  <ListItem>
                    <Split hasGutter>
                      <SplitItem isFilled>Issue raised for</SplitItem>
                      <SplitItem>
                        <Label color="red" isCompact>
                          {module}
                        </Label>
                      </SplitItem>
                    </Split>
                  </ListItem>
                  <ListItem>
                    <Split hasGutter>
                      <SplitItem isFilled>Type</SplitItem>
                      <SplitItem>
                        <Label
                          color={category === FeedbackCategoryAPI.BUG ? 'red' : 'green'}
                          isCompact
                        >
                          {category}
                        </Label>
                      </SplitItem>
                      <SplitItem>
                        <Label color={error ? 'red' : 'green'} isCompact>
                          {error || experience}
                        </Label>
                      </SplitItem>
                    </Split>
                  </ListItem>
                  <ListItem>
                    <Split hasGutter>
                      <SplitItem isFilled>Status</SplitItem>
                      <SplitItem>
                        <Label color="red" isCompact>
                          {state}
                        </Label>
                      </SplitItem>
                    </Split>
                  </ListItem>
                  <ListItem>
                    <Split hasGutter>
                      <SplitItem isFilled>Assignee(s)</SplitItem>
                      {assignee?.name && (
                        <SplitItem>
                          <Label color="green" isCompact>
                            {assignee?.name}
                          </Label>
                        </SplitItem>
                      )}
                    </Split>
                  </ListItem>
                </List>
              </StackItem>
            </Stack>
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );
};

FeedbackDetailCard.defaultProps = {
  feedback: undefined,
  isLoading: false,
};
