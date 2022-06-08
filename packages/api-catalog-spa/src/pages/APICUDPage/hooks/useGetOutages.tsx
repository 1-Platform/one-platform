import { useQuery } from 'hooks';
import { OutageStatusComponent } from 'api/types';
import { UseQueryReturn } from 'hooks/useQuery/types';

const GET_OUTAGES = /* GraphQL */ `
  query ListAPIOutageStatus {
    listAPIOutageStatus {
      id
      name
    }
  }
`;

type UseGetOutagesQuery = {
  listAPIOutageStatus: OutageStatusComponent[];
};

export const useGetOutages = (): UseQueryReturn<UseGetOutagesQuery> => {
  const query = useQuery<UseGetOutagesQuery, {}>({
    gql: GET_OUTAGES,
  });

  return query;
};
