import { Flex, FlexItem } from '@patternfly/react-core';
import { useContext } from 'react';
import HeaderContextProvider from 'common/context/HeaderContext';
import ProjectContextProvider, { ProjectContext } from 'common/context/ProjectContext';
import Header from 'common/components/Header';
import Loader from 'common/components/Loader';
import Sidebar from 'common/components/Sidebar';

function ProjectConsoleShell(props: any) {
  const { loading } = useContext(ProjectContext);

  return (
    <>
      <ProjectContextProvider>
        <Flex direction={{ default: 'row'}} flexWrap={{ default: 'nowrap'}}>
          <FlexItem
            flex={{ sm: 'flex_1' }}
            style={{
              minWidth: '13.75rem',
              maxWidth: '16rem',
              marginRight: 0,
              position: 'sticky',
              top: 'var(--op-nav__height)',
              zIndex: 98
            }}
          >
            <Sidebar />
          </FlexItem>
          <FlexItem flex={{ sm: 'flex_4' }}>
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
      </ProjectContextProvider>
    </>
  );
}

export default ProjectConsoleShell;
