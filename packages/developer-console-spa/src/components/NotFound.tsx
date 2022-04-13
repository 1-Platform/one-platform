import React from 'react';

function NotFound({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <h1>Not Found</h1>
      { children }
    </>
  );
}

export default NotFound;
