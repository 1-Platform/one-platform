import { fetch } from 'undici';

export function formatSearchInput(data: any) {
  const documents = [] as Array<any>;
  data.schemas.forEach((schema: any) => {
    const document = {
      // eslint-disable-next-line no-underscore-dangle
      id: schema._id.toString(),
      title: data.name,
      abstract: data?.description || '',
      description: schema.description || '',
      icon: 'assets/icons/api-catalog.svg',
      uri: `${process.env.SPA_URL}/apis/${data.slug}`,
      tags: `API Catalog, ${data.name}`,
      contentType: 'API Catalog',
      createdBy: data?.createdBy || 'System',
      createdDate: data?.createdOn || new Date(),
      lastModifiedBy: data?.updatedBy || 'System',
      lastModifiedDate: data?.updatedOn || new Date(),
    } as any;
    documents.push(document);
  });
  const searchPayload = {
    input: {
      dataSource: process.env.SEARCH_DATA_SOURCE,
      documents,
    },
  };
  return searchPayload;
}

export async function manageSearchIndex(data: any, mode: string) {
  const searchResponse: any = await fetch(`${process.env.API_GATEWAY_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `${process.env.API_GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation ManageIndex($input: SearchInput, $mode: String!) {
          manageIndex(input: $input, mode: $mode) {
            status
          }
        }`,
      variables: {
        input: data.input,
        mode,
      },
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  });
  const succesStatusCodes = [200, 204];
  if (!succesStatusCodes.includes(searchResponse.data.manageIndex.status)) {
    throw new Error('Error in index updation.');
  }
  return searchResponse;
}
