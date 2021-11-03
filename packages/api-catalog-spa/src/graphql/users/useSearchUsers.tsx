import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from 'hooks/useQuery';
import { UseQueryReturn } from 'hooks/useQuery/types';
import { UserRoverDetails } from './types';

const GET_USERS = `
  query ($search: String!) {
    searchRoverUsers(ldapfield:uid,value:$search){
        mail
        cn
        rhatUUID
    }
  }
`;

type UseSearchUsersProps = {
  search: string;
};

type UserSearchQuery = { searchRoverUsers: UserRoverDetails[] };

type UseSearchUsersReturn = UseQueryReturn<UserSearchQuery>;

export const useSearchUsers = ({ search = '' }: UseSearchUsersProps): UseSearchUsersReturn => {
  const searchCancelRef = useRef(new AbortController());
  const searchUserQuery = useQuery<UserSearchQuery, UseSearchUsersProps>({
    gql: GET_USERS,
    variables: { search },
    pause: search.length < 3 || search.includes('@'),
    requestPolicy: 'cache-first',
    context: useMemo(
      () => ({
        fetchOptions: () => {
          const token = window.OpAuthHelper.jwtToken;
          return {
            signal: searchCancelRef.current.signal,
            headers: { authorization: token ? `Bearer ${token}` : '' },
          };
        },
      }),
      []
    ),
  });

  useEffect(() => {
    searchCancelRef.current.abort();
  }, [search]);

  return searchUserQuery;
};
