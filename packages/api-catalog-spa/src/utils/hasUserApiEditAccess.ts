import { Namespace, UserRoverDetails, ApiEmailGroup } from 'api/types';

export const hasUserApiEditAccess = (
  userUuid: string,
  namespace?: Pick<Namespace, 'createdBy' | 'owners'>
): boolean => {
  if (!namespace) return false;
  const isApiCreatedUser = userUuid === (namespace?.createdBy as UserRoverDetails)?.rhatUUID;
  const isOwner =
    namespace?.owners.findIndex(
      (owner) => owner.group === ApiEmailGroup.USER && owner?.user?.rhatUUID === userUuid
    ) !== -1;
  return isApiCreatedUser || isOwner;
};
