export type Breadcrumb = {
  label: string;
  url: string;
};

export type BreadcrumbContextProps = {
  handleDynamicCrumbs: (crumb: Record<string, Breadcrumb>) => void;
  breadcrumbs: Breadcrumb[];
};
