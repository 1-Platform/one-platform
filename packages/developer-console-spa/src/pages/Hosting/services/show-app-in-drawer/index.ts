import gqlClient from 'common/utils/gqlClient';
import query from './query.gql';

export default async function showAppInDrawer(appId: string, enable: boolean) {
  const res = await gqlClient({ query, variables: { appId, enable } });

  if (res.errors || !res?.data?.showAppInDrawer) {
    const errMessage = res.errors.map((err: any) => err.message).join(', ');
    throw new Error(errMessage);
  } else if (!res.data.ok) {
    throw new Error(res.data.errMessage);
  }
  return res.data.showAppInDrawer;
}
