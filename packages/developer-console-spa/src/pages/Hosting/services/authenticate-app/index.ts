import gqlClient from 'common/utils/gqlClient';
import query from './query.gql';

export default async function authenticateApp(appId: string, enable: boolean) {
  const res = await gqlClient({ query, variables: { appId, enable } });

  if (res.errors || !res?.data?.authenticateApp) {
    const errMessage = res.errors.map((err: any) => err.message).join(', ');
    throw new Error(errMessage);
  }
  return res.data.authenticateApp;
}
