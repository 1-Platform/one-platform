import gqlClient from 'common/utils/gqlClient';
import { updateSearchMap } from 'common/utils/gql-queries'

export const updateSearchConfigService = async ( appId: string, searchMap: Partial<Project.SearchConfig> ) => {
  try {
    const res = await gqlClient( { query: updateSearchMap, variables: { appId, searchMap } } );
    if (res.errors && !res?.data?.updateSearchMap) {
      const errMessage = res.errors.map((err: any) => err.message).join(', ');
      throw new Error(errMessage);
    }
    return res.data.updateSearchMap;
  } catch ( err ) {
    throw err;
  }
};
