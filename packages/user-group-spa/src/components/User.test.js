import React from 'react';
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import User from "./User";
import BreadcrumbContextProvider from "../context/BreadcrumbContext";
import Router from "react-router-dom";
import { userData } from '../mocks/data';

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

test( 'shows user profile', async () => {
  // Mocking windows helper fn
  global.window.OpAuthHelper = {
    getUserInfo: jest.fn().mockImplementation(() => userData),
  };
  // Mocking and returning mocked value from useParam() of react-router-dom
  jest.spyOn(Router, "useParams").mockReturnValue({ cn: "gslohar" });

  const { getByText, container } = render(
    <MemoryRouter>
      <BreadcrumbContextProvider>
        <User />
      </BreadcrumbContextProvider>
    </MemoryRouter>
  );

  const userName = userData.fullName;
  const userTitle = userData.title;
  const userEmail = userData.email;

  const fullNameEl = getByText(userName);
  const titleEl = getByText(userTitle);
  const emailEl = getByText(userEmail);

  expect(container).toBeInTheDocument();
  expect(titleEl).toBeInTheDocument();
  expect(fullNameEl).toBeInTheDocument();
  expect(emailEl).toBeInTheDocument();
} );
