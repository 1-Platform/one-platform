import { useCallback } from 'react';
import {
  Button,
  Divider,
  Label,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import dayjs from 'dayjs';
import { FeedbackCategoryAPI } from 'types';
import bugImgUrl from 'assets/images/bug.svg';
import feedbackImgUrl from 'assets/images/feedback.svg';
import styles from './feedbackCard.module.css';

type Props = {
  title: string;
  description: string;
  createdOn: string;
  error?: string;
  experience?: string;
  state: string;
  module: string;
  category: FeedbackCategoryAPI;
  onClick: () => void;
};

const MAX_SUMMARY_CHARACTERS = 200;

export const FeedbackCard = ({
  onClick,
  title,
  createdOn,
  error,
  experience,
  module,
  category,
  description,
  state,
}: Props): JSX.Element => {
  const formatDate = useCallback((date: string) => {
    return dayjs(date).format('DD MMMM, YYYY');
  }, []);

  const clampDescriptionLength = useCallback((desc: string) => {
    return desc.length > 200 ? `${desc.slice(0, MAX_SUMMARY_CHARACTERS)}...` : desc;
  }, []);

  return (
    <Split hasGutter>
      <SplitItem>
        <div className={styles.feedbackIcon}>
          <img
            src={category === FeedbackCategoryAPI.BUG ? bugImgUrl : feedbackImgUrl}
            alt="category"
          />
        </div>
      </SplitItem>
      <SplitItem isFilled>
        <Stack>
          <StackItem>
            <Split hasGutter>
              <SplitItem>
                <Title headingLevel="h6" size="md" className={styles.feedbackTitle}>
                  {title} - {formatDate(createdOn)}
                </Title>
              </SplitItem>
              <SplitItem isFilled>
                <Label color="blue" isCompact>
                  {state}
                </Label>
              </SplitItem>
              <SplitItem>
                <Label color="red" isCompact>
                  {module}
                </Label>
              </SplitItem>
              <SplitItem>
                <Label color={error ? 'red' : 'green'} isCompact>
                  {error || experience}
                </Label>
              </SplitItem>
            </Split>
          </StackItem>
          <StackItem style={{ margin: '0.75rem 0 1rem 0' }}>
            {clampDescriptionLength(description)}
            <Button variant="link" isInline onClick={onClick} style={{ padding: '0 0.25rem' }}>
              View more
            </Button>
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
        </Stack>
      </SplitItem>
    </Split>
  );
};

FeedbackCard.defaultProps = {
  error: null,
  experience: null,
};
