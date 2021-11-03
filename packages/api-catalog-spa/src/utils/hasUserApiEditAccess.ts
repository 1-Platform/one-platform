import { ApiEmailGroup, Namespace } from 'graphql/namespace/types';
import { UserRoverDetails } from 'graphql/users/types';

export const hasUserApiEditAccess = (userUuid: string, namespace?: Namespace): boolean => {
  if (!namespace) return false;
  const isApiCreatedUser = userUuid === (namespace?.createdBy as UserRoverDetails)?.rhatUUID;
  const isOwner =
    namespace?.owners.findIndex(
      (owner) => owner.group === ApiEmailGroup.USER && owner.user.rhatUUID === userUuid
    ) !== -1;
  return isApiCreatedUser || isOwner;
};
