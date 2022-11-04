import { createContext } from 'react';
import { useHistory, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import useProjectAPI from '../hooks/useProjectAPI';

export const ProjectContext = createContext<IProjectContext>({} as IProjectContext);

export default function ProjectContextProvider(props: any) {
  const { projectId } = useParams<RouteParams>();
  const router = useHistory();
  const location = useLocation();

  const { project, loading, setProject } = useProjectAPI(projectId);

  const navigateToProject = (newProjectId: string) => {
    const newPath =
      location.pathname.replace(projectId, newProjectId) +
      location.search +
      location.hash;
    router.push(newPath);
  };

  const forceRefresh = (newProject: Project) => {
    setProject({ ...project, ...newProject });
  };

  return (
    <ProjectContext.Provider
      value={{
        projectId,
        project,
        loading,
        navigateToProject,
        forceRefresh,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
}
