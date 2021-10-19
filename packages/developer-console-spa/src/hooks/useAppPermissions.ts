import { useEffect, useState } from 'react';
import { appPermissionsQuery } from 'utils/gql-queries';
import gqlClient from 'utils/gqlClient';

export default function useAppPermissions ( appId: string ) {
  const [ appPermissions, setAppPermissions ] = useState<App.Permission[]>( [] );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    if ( !appId ) {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading( true );

    gqlClient( { query: appPermissionsQuery, variables: { appId } }, signal )
      .then( res => {
        if ( !res?.data ) {
          setLoading( false );
          return;
        }
        setAppPermissions( res.data?.app?.permissions ?? [] );
        setLoading( false );
      } )
      .catch( err => {
        console.debug( err );
        window.OpNotification?.danger( {
          subject: 'There was some error fetching permissions.',
          body: 'Please try again later.'
        } );
      } );

    return () => abortController.abort();
  }, [ appId ] );

  return { appPermissions, setAppPermissions, loading };
}
