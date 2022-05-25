import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs/esm';
import {
  Split,
  SplitItem,
  Text,
  Label,
  Title,
  TextVariants,
  Stack,
  StackItem,
  Button,
} from '@patternfly/react-core';
import { EditIcon, UserIcon, UsersIcon } from '@patternfly/react-icons';
import { Namespace, OwnerMailingType, OwnerUserType, ApiEmailGroup } from 'api/types';

import { ReadMore } from 'components/ReadMore';

interface Props {
  namespace?: Pick<Namespace, 'owners' | 'updatedOn' | 'name' | 'description'>;
  id?: string;
  hasEditAccess: boolean;
}

export const DetailsSection = ({ namespace, id, hasEditAccess }: Props): JSX.Element => {
  const formatUpdatedAt = useCallback(
    (apiUpdatedAt: string) => `Modified on: ${dayjs(apiUpdatedAt).format('DD MMM YYYY hh:mm a')}`,
    []
  );

  return (
    <Stack hasGutter>
      <StackItem className="pf-u-mb-sm">
        <Split hasGutter className="pf-u-align-items-center">
          <SplitItem>
            <Title headingLevel="h1">{namespace?.name}</Title>
          </SplitItem>
          <SplitItem className="pf-u-mr-xs">
            <Text component={TextVariants.small} className="pf-u-color-200">
              {formatUpdatedAt(namespace?.updatedOn || '')}
            </Text>
          </SplitItem>
          {hasEditAccess && (
            <SplitItem>
              <Link to={`/apis/edit/${id}`}>
                <Button variant="plain">
                  <EditIcon />
                </Button>
              </Link>
            </SplitItem>
          )}
        </Split>
      </StackItem>
      <StackItem>
        <Split className="pf-u-align-items-center">
          <SplitItem className="pf-u-mr-sm">
            <Text>Owned by</Text>
          </SplitItem>
          <SplitItem>
            <Split>
              <ReadMore limit={3} showMoreText={`+${(namespace?.owners || []).length - 3} more`}>
                {namespace?.owners?.map((owner, index) => {
                  const isUser = owner?.group === ApiEmailGroup.USER;
                  return (
                    <SplitItem key={`${owner.group}-${index + 1}`} className="pf-u-ml-sm">
                      <Label icon={isUser ? <UserIcon /> : <UsersIcon />} color="blue" isCompact>
                        {isUser
                          ? (owner as OwnerUserType).user.cn
                          : (owner as OwnerMailingType).email}
                      </Label>
                    </SplitItem>
                  );
                })}
              </ReadMore>
            </Split>
          </SplitItem>
        </Split>
      </StackItem>
      <StackItem className="pf-u-mt-sm">
        <ReadMore>{namespace?.description || ''}</ReadMore>
      </StackItem>
    </Stack>
  );
};
