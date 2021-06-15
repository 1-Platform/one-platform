import { createContext } from 'react';
import { useParams } from 'react-router';
import useAppAPI from '../hooks/useAppAPI';

export const AppContext = createContext<any>( {} );

export default function AppContextProvider ( props: any ) {
  const { appId } = useParams<any>();

  const { app, loading } = useAppAPI(appId);

  return (
    <AppContext.Provider value={{ app, loading }}>
      {props.children}
    </AppContext.Provider>
  )
}
