import { EmptyState, EmptyStateBody, Flex, FlexItem } from '@patternfly/react-core';
import { useContext, useEffect } from 'react';
import HeaderContextProvider from 'common/context/HeaderContext';
import { ProjectContext } from 'common/context/ProjectContext';
import Header from 'common/components/Header';
import Loader from 'common/components/Loader';
import Sidebar from 'common/components/Sidebar';
import { Link, useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';

function ProjectConsoleShell(props: any) {
  const { project, loading } = useContext(ProjectContext);
  const history = useHistory();

  useEffect(() => {
    if (!loading && isEmpty(project)) {
      window.OpNotification?.danger({
        subject: 'Could not open the project page',
        body: 'Please check if the url is correct and that you have access to the project and try again.',
      } );
      history.replace( '/' );
    }
  }, [history, loading, project]);

  if (!loading && isEmpty(project)) {
    /* If the project does not exist, don't render anything and wait for the redirect */
    return <>
      <EmptyState>
        <EmptyStateBody>
          <p>Project not found. Redirecting you back to home.</p>
          <p>If you are not redirected in 5 seconds, please <Link to="/">click here</Link>.</p>
        </EmptyStateBody>
      </EmptyState>
    </>;
  }

  return (
    <>
      <Flex direction={{ default: 'row' }} flexWrap={{ default: 'nowrap' }}>
        <FlexItem
          flex={{ default: 'flexNone' }}
          style={{
            minWidth: '13.75rem',
            maxWidth: '16rem',
            marginRight: 0,
            position: 'sticky',
            top: 'var(--op-nav__height)',
            zIndex: 98,
          }}
        >
          <Sidebar />
        </FlexItem>
        <FlexItem flex={{ sm: 'flex_1' }}>
          {loading ? (
            <Loader />
          ) : (
            <HeaderContextProvider>
              <Header />
              <main className="container">{props.children}</main>
            </HeaderContextProvider>
          )}
        </FlexItem>
      </Flex>
    </>
  );
}

export default ProjectConsoleShell;
