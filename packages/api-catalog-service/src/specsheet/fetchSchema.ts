import { fetch } from 'undici';
import { getIntrospectionQuery } from 'graphql';
import { ApiCategory, ApiHeaderType } from 'graph/types';

export const fetchSchema = async (
  category: ApiCategory,
  schemaEndpoint: string,
  apiHeaders: ApiHeaderType[],
) => {
  const headers =
    apiHeaders
      ?.filter(({ key, value }) => key && value)
      .reduce(
        (obj, item) => Object.assign(obj, { [(item as any).key]: (item as any).value }),
        {},
      ) || undefined;
  const isGraphqlAPI = category === ApiCategory.GRAPHQL;
  return fetch(schemaEndpoint, {
    method: isGraphqlAPI ? 'POST' : 'GET',
    headers,
    body: isGraphqlAPI ? JSON.stringify({ query: getIntrospectionQuery() }) : undefined,
  }).then((response) => {
    if (response.ok) {
      return response.text();
    }
    return Promise.reject(response);
  });
};
