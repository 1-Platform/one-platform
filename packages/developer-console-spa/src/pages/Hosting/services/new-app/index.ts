import gqlClient from 'common/utils/gqlClient';
import query from './query.gql';

export default async function newApp(app: any) {
  const res = await gqlClient({ query, variables: { app } });

  if (res.errors && !res?.data?.newApp) {
    const errMessage = res.errors.map((err: any) => err.message).join(', ');
    throw new Error(errMessage);
  }
  return res.data.newApp;
}
