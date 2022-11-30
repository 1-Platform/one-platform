import { useEffect, useState } from 'react';
import { getLHSpaConfigByAppId } from 'common/services/lighthouse';

export default function useLighthouseConfig ( projectId: string ) {
  const [ lighthouseConfig, setLighthouseConfig ] = useState<Lighthouse.Config>( {} as Lighthouse.Config );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    if ( !projectId ) {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading( true );

    getLHSpaConfigByAppId( projectId, signal )
      .then( res => {
        setLighthouseConfig( res || {} );
        setLoading( false );
      } )
      .catch( err => {
        setLoading( false );
        window.OpNotification?.danger( {
          subject: 'There was some error fetching lighthouse configuration.',
          body: 'Please try again later.'
        } );
      });

    return () => abortController.abort();
  }, [ projectId ] );

  return { lighthouseConfig, setLighthouseConfig, loading };
}
