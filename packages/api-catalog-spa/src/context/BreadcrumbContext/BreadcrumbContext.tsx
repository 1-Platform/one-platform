import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { ApiCatalogLinks } from 'router';
import { BREADCRUMB_USERFLOW, LOOK_UP_TABLE } from './lookupTable';
import { Breadcrumb, BreadcrumbContextProps } from './types';

const BreadcrumbContext = createContext<BreadcrumbContextProps | Record<string, unknown>>({});

export const BreadcrumbProvider: React.FC = ({ children }) => {
  // load it up
  const [dynamicCrumbs, setDynamicCrumbs] = useState<Record<string, Breadcrumb>>();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const { pathname } = useLocation();

  const handleDynamicCrumbs = useCallback((crumb: Record<string, Breadcrumb>): void => {
    // save recent visit to quick link
    setDynamicCrumbs((state) => ({ ...state, ...crumb }));
  }, []);

  useEffect(() => {
    const path = pathname.replace(process.env.PUBLIC_URL, '');
    const matchedPath = (Object.keys(BREADCRUMB_USERFLOW) as ApiCatalogLinks[]).find((pattern) =>
      Boolean(matchPath(pattern, path))
    );
    if (matchedPath) {
      const crumbs = BREADCRUMB_USERFLOW[matchedPath]
        .map((userflow) =>
          LOOK_UP_TABLE?.[userflow] ? LOOK_UP_TABLE?.[userflow] : dynamicCrumbs?.[userflow]
        )
        .filter((crumb) => Boolean(crumb)) as Breadcrumb[];
      setBreadcrumbs(crumbs);
    } else {
      setBreadcrumbs([]);
    }
  }, [pathname, dynamicCrumbs]);

  /**
   * Context value to access glabally from anywhere
   * Memo to optimize at best
   */
  const value = useMemo(
    () => ({
      breadcrumbs,
      handleDynamicCrumbs,
    }),

    [breadcrumbs, handleDynamicCrumbs]
  );

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>;
};

export const useBreadcrumb = (): BreadcrumbContextProps =>
  useContext(BreadcrumbContext) as BreadcrumbContextProps;
