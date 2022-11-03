import { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Tab, Tabs } from '@patternfly/react-core';
import { ProjectContext } from 'common/context/ProjectContext';
import { HeaderContext } from 'common/context/HeaderContext';
import useQueryParams from 'common/hooks/useQueryParams';
import General from './General';
import APIKeys from './APIKeys';
import Permissions from './Permissions';
import Loader from 'common/components/Loader';

export default function AppSettings () {
  const history = useHistory();
  const { projectId, project, loading } = useContext( ProjectContext );
  const { setHeader } = useContext( HeaderContext );
  const searchParams = useQueryParams();
  const [ activeTab, setActiveTab ] = useState( 'general' );

  useEffect(() => {
    setHeader([
      { title: 'Settings', path: `/${projectId}/settings` },
    ]);
    return () => setHeader([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

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
      <Tabs mountOnEnter activeKey={ activeTab } onSelect={ handleTabChange }>
        { tabs.map( tab => (
          <Tab key={ tab.key } eventKey={ tab.key } title={ tab.title }>
            <tab.component project={project} />
          </Tab>
        ) ) }
      </Tabs>
    </>
  );
}
