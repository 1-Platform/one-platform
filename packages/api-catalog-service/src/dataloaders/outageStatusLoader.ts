import DataLoader from 'dataloader';
import { OutageStatusAPI } from 'datasources/outageStatusAPI';
import { OutageAPI } from 'datasources/types';

export const setupOutageStatusLoader = (outageStatusDatasource: OutageStatusAPI) => {
  const loader = new DataLoader(async (keys: readonly string[]) => {
    const res = await outageStatusDatasource.getOutageStatusList();
    const outageGroupedByID = res.reduce<Record<string, OutageAPI['components'][0]>>(
      (prev, curr) => ({ ...prev, [curr.id]: curr }),
      {},
    );

    return keys.map((id) => outageGroupedByID?.[id] || null);
  });

  return loader;
};
