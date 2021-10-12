import { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Tab, Tabs } from '@patternfly/react-core';
import { AppContext } from 'context/AppContext';
import useQueryParams from 'hooks/useQueryParams';
import Header from 'components/Header';
import Loader from 'components/Loader';
import General from './General';
import APIKeys from './APIKeys';
import Permissions from './Permissions';

export default function AppSettings () {
  const history = useHistory();
  const { app, loading } = useContext( AppContext );
  const searchParams = useQueryParams();
  const [ activeTab, setActiveTab ] = useState( 'general' );

  useEffect( () => {
    setActiveTab( searchParams.get( 'tab' ) ?? 'general' );
  }, [ searchParams ] );

  const tabs = useMemo(() => [
    { key: 'general', title: 'General', component: General },
    { key: 'permissions', title: 'Permissions', component: Permissions },
    { key: 'api-keys', title: 'API Keys', component: APIKeys },
  ], []);

  const handleTabChange = ( event: React.MouseEvent<HTMLElement, MouseEvent>, tab: string | number ) => {
    const search = searchParams;
    search.set( 'tab', tab.toString() );
    history.push( { search: search.toString() } );
  }

  if ( loading ) {
    return <Loader />;
  }
  return (
    <>
      <Header title="App Settings" />

      <Tabs mountOnEnter activeKey={ activeTab } onSelect={ handleTabChange }>
        { tabs.map( tab => (
          <Tab key={ tab.key } eventKey={ tab.key } title={ tab.title }>
            <tab.component app={app} />
          </Tab>
        ) ) }
      </Tabs>
    </>
  );
}
