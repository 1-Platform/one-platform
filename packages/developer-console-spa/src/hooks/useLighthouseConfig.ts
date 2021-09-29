import { useEffect, useState } from 'react';
import { getLHSpaConfigByAppId } from '../services/lighthouse';

export default function useLighthouseConfig ( id: string ): {lighthouseConfig: error;
setLighthouseConfig: error;
loading: error;
}  {
  const [ lighthouseConfig, setLighthouseConfig ] = useState<any>( {} );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    if ( !id ) {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading( true );

    getLHSpaConfigByAppId( id, signal )
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
  }, [ id ] );

  return { lighthouseConfig, setLighthouseConfig, loading };
}
