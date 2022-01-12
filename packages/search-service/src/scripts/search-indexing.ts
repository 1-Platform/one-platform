import { chunk } from 'lodash';
import { TemplateHelper } from '../search-mapping/helpers';
import { SearchMaps } from '../search-mapping/schema';
import { index } from '../services/search';
import { SEARCH_DATA_SOURCE } from '../setup/env';
import getValueBySelector from '../utils/search-map-getter';

export default async function startIndexing() {
  const apps = await TemplateHelper.listApps();
  const searchMaps = await SearchMaps.find().exec();
  const indexedData = searchMaps.map(async (searchMap) => {
    const app = apps.filter((tapp: any) => tapp._id === searchMap.appId);

    const authHeader = `${searchMap.authorization.authType} ${searchMap.authorization.credentials}`;
    const response = await TemplateHelper.fetchApi(
      authHeader,
      searchMap.apiUrl,
      searchMap.body,
      searchMap.apiQueryParams,
      searchMap.method,
    );
    return response[Object.keys(response)[0]].map((data: any) => ({
      content_type: app.name ?? 'unknown',
      id: getValueBySelector(data, searchMap.fieldMap.id, { stringify: true, fallback: null }),
      title: getValueBySelector(data, searchMap.fieldMap.title, { stringify: true, fallback: null }),
      abstract: getValueBySelector(data, searchMap.fieldMap.abstract, { stringify: true, fallback: null }),
      description: getValueBySelector(data, searchMap.fieldMap.description, { stringify: true, fallback: null }),
      icon: getValueBySelector(data, searchMap.fieldMap.icon, { stringify: true, fallback: null }),
      uri: getValueBySelector(data, searchMap.fieldMap.uri, { stringify: true, fallback: null }),
      tags: getValueBySelector(data, searchMap.fieldMap.tags, { stringify: true, fallback: null }),
      createdBy: getValueBySelector(data, searchMap.fieldMap.createdBy, { stringify: true, fallback: null }),
      createdDate: getValueBySelector(data, searchMap.fieldMap.createdDate, { stringify: true, fallback: null }),
      lastModifiedBy: getValueBySelector(data, searchMap.fieldMap.lastModifiedBy, { stringify: true, fallback: null }),
      lastModifiedDate: getValueBySelector(data, searchMap.fieldMap.lastModifiedDate, { stringify: true, fallback: null }),
    }));
  });

  /* Create chunks of 100 indexes each and send */
  return Promise.all(chunk(indexedData, 100)
    .map((documents) => index({
      dataSource: SEARCH_DATA_SOURCE,
      documents,
    }, 3)));
}
