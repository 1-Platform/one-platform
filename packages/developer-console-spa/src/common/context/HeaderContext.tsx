import { createContext, ReactNode, useState } from 'react';

export const HeaderContext = createContext<IHeaderContext>({} as IHeaderContext);

export default function HeaderContextProvider(props: any) {
  const [pageTitle, setPageTitle] = useState<HeaderTitle[]>([]);
  const [ links, setLinks ] = useState<ReactNode[]>( [] );
  const defaultTitle = {
    title: 'Home',
    path: '/',
  }

  const setHeader = (args: string[] | HeaderTitle[]) => {
    const crumbs = args.map((arg: string | HeaderTitle) => {
      if (typeof arg === 'string') {
        return {
          title: arg,
        };
      }
      return arg;
    });

    setPageTitle( [
      defaultTitle,
      ...crumbs
    ] );
  };

  const setHeaderLinks = (components: ReactNode[]) => {
    setLinks(components);
  }

  return (
    <HeaderContext.Provider value={{ pageTitle, links, setHeader, setHeaderLinks }}>
      {props.children}
    </HeaderContext.Provider>
  );
}
