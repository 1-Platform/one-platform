type RouteParams = {
  projectId: string
}

interface IProjectContext {
  projectId: string
  project: Project
  loading: boolean
  navigateToProject: React.Dispatch<string>
  forceRefresh: any
}

type HeaderTitle = {
  title: string;
  path?: string;
};
interface IHeaderContext {
  pageTitle: HeaderTitle[];
  setHeader: React.Dispatch<string[] | HeaderTitle[]>;
  links: React.ReactNode[];
  setHeaderLinks: React.Dispatch<React.ReactNode[]>;
}
