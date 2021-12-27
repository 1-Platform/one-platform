import React from 'react';
import { render as rtlRender } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import BreadcrumbContextProvider from "./context/BreadcrumbContext.jsx";

test('renders user group SPA home', () => {
  const { getByText } = rtlRender(
    <MemoryRouter>
      <BreadcrumbContextProvider>
        <App />
      </BreadcrumbContextProvider>
    </MemoryRouter>
  );
  const myProfileMenu = getByText( /My Profile/i );
  const userGroupsMenu = getByText( /User Groups/i );

  expect(myProfileMenu).toBeInTheDocument();
  expect(userGroupsMenu.classList.contains("pf-m-current")).toBe(true);
} );
