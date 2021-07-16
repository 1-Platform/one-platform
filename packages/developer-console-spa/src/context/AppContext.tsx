import { createContext } from 'react';
import { useHistory, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import useAppAPI from '../hooks/useAppAPI';

export const AppContext = createContext<any>( {} );

export default function AppContextProvider ( props: any ) {
  const { appId } = useParams<any>();
  const router = useHistory();
  const location = useLocation();

  const { app, loading, setApp: setOriginalApp } = useAppAPI(appId);

  const setApp = (newAppId: string) => {
    const newPath = location.pathname.replace( appId, newAppId ) + location.search + location.hash;
    router.push( newPath );
  }

  const forceRefreshApp = ( newApp: any ) => {
    setOriginalApp( { ...app, ...newApp} );
  }

  return (
    <AppContext.Provider value={ { app, loading, setApp, forceRefreshApp }}>
      {props.children}
    </AppContext.Provider>
  )
}
