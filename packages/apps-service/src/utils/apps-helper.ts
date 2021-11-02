/* eslint-disable no-underscore-dangle */
import fetch, { Headers } from 'cross-fetch';
import Logger from '../lib/logger';
import { API_GATEWAY, GATEWAY_AUTH_TOKEN, SEARCH_DATA_SOURCE } from '../setup/env';

function formatSearchInput(data: any) {
  return {
    input: {
      dataSource: SEARCH_DATA_SOURCE,
      documents: {
        id: data._id,
        title: data.name,
        abstract: data.description,
        description: data.description,
        icon: '',
        uri: data.path,
        tags: 'Apps',
        contentType: 'Apps',
        createdBy: data?.createdBy || '',
        createdDate: data?.createdOn || new Date(),
        lastModifiedBy: data?.updatedBy || '',
        lastModifiedDate: data?.updatedOn || new Date(),
      },
    },
  };
}

// Helper function to create/update/delete data to feedback microservice
function manageSearchIndex(data: any, mode: string) {
  const query: string = `
                mutation ManageIndex($input: SearchInput, $mode: String!) {
                    manageIndex(input: $input, mode: $mode) {
                        status
                    }
                }
            `;
  const headers = new Headers();
  headers.append('Authorization', GATEWAY_AUTH_TOKEN);
  headers.append('Content-Type', 'application/json');
  return fetch(API_GATEWAY, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables: {
        input: mode === 'index' ? data?.input : data,
        mode,
      },
    }),
  })
    .then((response: any) => response.json())
    .then((result: any) => {
      const succesStatusCodes = [200, 204];
      if (succesStatusCodes.includes(result.data?.manageIndex?.status)) {
        Logger.info('Sucessfully completed the index updation.');
      } else if (
        !succesStatusCodes.includes(result.data?.manageIndex?.status)
      ) {
        Logger.info('Error in index updation.');
      }
    })
    .catch((err: Error) => {
      throw err;
    });
}

export default { formatSearchInput, manageSearchIndex };
