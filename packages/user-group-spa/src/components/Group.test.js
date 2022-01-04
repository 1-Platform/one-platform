import React from 'react';
import { render, waitForElementToBeRemoved, screen } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import Group from "./Group";
import BreadcrumbContextProvider from "../context/BreadcrumbContext";
import Router from "react-router-dom";
import { server } from "../mocks/server.js";
import { rest } from "msw";
import { groupData } from '../mocks/data';

jest.mock( "react-router-dom", () => ( {
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
} ) );

test( 'renders group information', async () => {
  server.use(
    rest.post("http://localhost:8080/graphql", (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(groupData)
      );
    })
  );
  // Mocking and returning mocked value from useParam() of react-router-dom
  jest.spyOn(Router, "useParams").mockReturnValue({ cn: "one-platform" });

  const { getByText, container } = render(
    <MemoryRouter>
      <BreadcrumbContextProvider>
        <Group />
      </BreadcrumbContextProvider>
    </MemoryRouter>
  );

  await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

  const fullName = getByText(/One Platform Developers/i);
  const memberOne = getByText( /Deepesh Nair/i );
  const memberTwo = getByText(/Ghanshyam Lohar/i);

  expect( fullName ).toBeInTheDocument();
  expect( container ).toBeInTheDocument();
  expect( memberOne ).toBeInTheDocument();
  expect( memberTwo ).toBeInTheDocument();

} );
