import { useEffect, useState } from 'react';
import { projectFeedbackConfig } from 'common/utils/gql-queries';
import gqlClient from 'common/utils/gqlClient';

export default function useFeedbackConfig ( projectId: string ) {
  const [ feedbackConfig, setFeedbackConfig ] = useState<FeedbackConfig>( {} as FeedbackConfig );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    if ( !projectId ) {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading( true );

    gqlClient( { query: projectFeedbackConfig, variables: { projectId } }, signal )
      .then( res => {
        if ( !res || !res.data ) {
          setLoading( false );
          return;
        }
        setFeedbackConfig( res.data.getFeedbackConfigByAppId ?? {} );
        setLoading( false );
      } )
      .catch( err => {
        window.OpNotification?.danger( {
          subject: 'There was some error fetching feedback configuration.',
          body: 'Please try again later.'
        } );
      });

    return () => abortController.abort();
  }, [ projectId ] );

  return { feedbackConfig, setFeedbackConfig, loading };
}
