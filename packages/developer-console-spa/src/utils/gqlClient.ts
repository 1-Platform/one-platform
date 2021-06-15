type GQLRequestProps = {
  query: string;
  variables?: any;
  operationName?: any;
};

export default function gqlClient ( { query, variables }: GQLRequestProps, signal?: any ) {
  if ( !signal ) {
    const abortController = new AbortController();
    signal = abortController.signal;
    setTimeout( () => {
      abortController.abort();
    }, 5000 );
  }

  return fetch( process.env.REACT_APP_API_GATEWAY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.OpAuthHelper?.jwtToken}`
    },
    body: JSON.stringify( {
      query,
      variables
    } ),
    signal,
  } )
    .then( res => res.json() )
    .catch( ( err: Error ) => {
      if ( err.name === 'AbortError' ) {
        console.debug( '[GQLClient]: Request aborted' );
        return;
      }
      console.error( `[GQLClientError]: ${ err }` );
      throw err;
    } );
};
