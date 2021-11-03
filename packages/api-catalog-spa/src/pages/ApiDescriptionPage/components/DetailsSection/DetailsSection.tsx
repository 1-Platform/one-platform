import { useCallback } from 'react';
import dayjs from 'dayjs';
import {
  Split,
  SplitItem,
  Text,
  Label,
  LabelGroup,
  Grid,
  GridItem,
  Title,
  TextVariants,
} from '@patternfly/react-core';
import { urlProtocolRemover } from 'utils';
import { ReadMore } from 'components/ReadMore';
import { ApiEmailGroup, Namespace, OwnerMailingType, OwnerUserType } from 'graphql/namespace/types';
import { UserIcon, UsersIcon } from '@patternfly/react-icons';

interface Props {
  namespace?: Namespace;
}

export const DetailsSection = ({ namespace }: Props): JSX.Element => {
  const formatUpdatedAt = useCallback(
    (apiUpdatedAt: string) => `Modified on: ${dayjs(apiUpdatedAt).format('DD MMM YYYY hh:mm a')}`,
    []
  );

  const urlParser = useCallback((url: string) => urlProtocolRemover(url), []);

  return (
    <Grid hasGutter>
      <GridItem span={12}>
        <Split hasGutter className="pf-u-align-items-center">
          <SplitItem>
            <Title headingLevel="h1">{namespace?.name}</Title>
          </SplitItem>
          <SplitItem>
            <Text component={TextVariants.small} className="pf-u-color-200">
              {formatUpdatedAt(namespace?.updatedOn || '')}
            </Text>
          </SplitItem>
        </Split>
      </GridItem>
      <GridItem span={12}>
        <Split className="pf-u-align-items-center">
          <SplitItem className="pf-u-mr-sm">
            <Text>Owned by</Text>
          </SplitItem>
          <SplitItem>
            <LabelGroup>
              {namespace?.owners?.map((owner, index) => {
                const isUser = owner?.group === ApiEmailGroup.USER;
                return (
                  <Label
                    icon={isUser ? <UserIcon /> : <UsersIcon />}
                    color="blue"
                    key={`${owner.group}-${index + 1}`}
                  >
                    {isUser ? (owner as OwnerUserType).user.cn : (owner as OwnerMailingType).email}
                  </Label>
                );
              })}
            </LabelGroup>
          </SplitItem>
        </Split>
      </GridItem>
      <Grid span={12} hasGutter>
        <GridItem span={12}>
          <Title headingLevel="h3">About {namespace?.name}</Title>
          <ReadMore>{namespace?.description || ''}</ReadMore>
        </GridItem>
        <GridItem span={4}>
          <Title headingLevel="h3">Application URL</Title>
          <a href={namespace?.appUrl} target="_blank" rel="noopener noreferrer">
            <Text className="pf-u-color-400">{urlParser(namespace?.appUrl || '')}</Text>
          </a>
        </GridItem>
        <GridItem span={5}>
          <Title headingLevel="h3">Schema Documentation URL</Title>
          <a href={namespace?.schemaEndpoint} target="_blank" rel="noopener noreferrer">
            <Text className="pf-u-color-400">{urlParser(namespace?.schemaEndpoint || '')}</Text>
          </a>
        </GridItem>
      </Grid>
    </Grid>
  );
};
