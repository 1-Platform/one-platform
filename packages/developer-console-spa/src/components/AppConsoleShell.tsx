import { Grid, GridItem } from '@patternfly/react-core';
import { useContext } from 'react';
import AppContextProvider, { AppContext } from '../context/AppContext';
import Loader from './Loader';
import Sidebar from './Sidebar';

function AppConsoleShell ( props: any ) {
  const { loading } = useContext( AppContext );

  return (
    <>
      <AppContextProvider>
        <Grid hasGutter>
          <GridItem span={ 3 } xl={2}>
            <Sidebar />
          </GridItem>
          <GridItem span={ 9 } xl={10}>
            { loading
              ? <Loader />
              : <main className="container">
                { props.children }
              </main> }
          </GridItem>
        </Grid>
      </AppContextProvider>
    </>
  )
}

export default AppConsoleShell;
