import { Voyager } from 'graphql-voyager';

function introspectionProvider ( query: any, authorizationToken: string ) {
  return fetch('http://graphql-typescript-server.herokuapp.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorizationToken
    },
    body: JSON.stringify({ query: query }),
  }).then((response) => response.json());
}
export const GraphqlApiView = () => <Voyager introspection={ introspectionProvider } workerURI={ 'https://unpkg.com/graphql-voyager@1.0.0-rc.31/dist/voyager.worker.js'} />
