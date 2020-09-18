import React, { createContext, useState } from 'react';

export const BreadcrumbContext = createContext();

function BreadcrumbContextProvider ( props ) {
  const defaultCrumbs = [
    { name: 'Home', href: '/' },
    { name: 'User Groups', href: process.env.PUBLIC_URL },
  ];

  const [ crumbs, setCrumbs ] = useState( [ defaultCrumbs ] );

  function updateCrumbs ( newCrumbs ) {
    setCrumbs( [
      ...defaultCrumbs,
      ...newCrumbs
    ] );
  }

  return (
    <BreadcrumbContext.Provider value={ { crumbs, updateCrumbs }}>
      { props.children }
    </BreadcrumbContext.Provider>
  );
}

export default BreadcrumbContextProvider;
