import React from 'react';
import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import Home from "./Home";
import BreadcrumbContextProvider from "../context/BreadcrumbContext";

test( 'loads user groups', async () => {
  const { getByText, container } = rtlRender(
    <MemoryRouter>
      <BreadcrumbContextProvider>
        <Home />
      </BreadcrumbContextProvider>
    </MemoryRouter>
  );

  await waitForElementToBeRemoved(() => screen.queryByText("Loading"));
  const common_Name = getByText(/LDAP\/Rover Common Name/i);
  const group_Name = getByText(/Group Name/i);
  const group = getByText(/DSAL Admins/i);

  expect(container).toBeInTheDocument();
  expect(group_Name).toBeInTheDocument();
  expect(common_Name).toBeInTheDocument();
  expect(group).toBeInTheDocument();

} );
