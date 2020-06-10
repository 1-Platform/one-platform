import fetch from 'node-fetch';

export const GqlHelper = {
  fragments: {
    homeType: `on HomeType {
      _id name link entityType owners { uid name }
    }`,
  },
  execSimpleQuery ( { queries, fragments }: GraphQLQueryInput ) {
    const body = {
      query: /* GraphQL */`
        ${ fragments?.join( '\n' ) }
        query GetNotificationSources {
          ${queries.join( '\n' ) }
        }`,
    };
    return fetch(
      `http://${ process.env.HOME_SERVICE_SERVICE_HOST }:${ process.env.HOME_SERVICE_SERVICE_PORT }/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify( body )
      }
    )
      .then( res => res.json() )
      .catch( err => {
        throw new Error( '[UserServiceApiError]: ' + err );
      } );
  }
};
