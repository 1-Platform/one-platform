import React from 'react';
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import Form from "./Form";
import BreadcrumbContextProvider from "../context/BreadcrumbContext";
import { server } from "../mocks/server.js";
import { addGroupData } from "../mocks/data.js"
import { rest } from "msw";
import userEvent from "@testing-library/user-event";

test( 'render user group form', async () => {
  const { container } = render(
    <MemoryRouter>
      <BreadcrumbContextProvider>
        <Form />
      </BreadcrumbContextProvider>
    </MemoryRouter>
  );

  const groupNameInput = screen.getByLabelText( /Group Name/i );
  const roverGroupInput = screen.getByPlaceholderText(/Enter the Rover\/LDAP common name.../i);
  const addGroupBtn = screen.getByRole( "button", { type: "submit" } );

  expect( container ).toBeInTheDocument();
  expect( groupNameInput ).toBeInTheDocument();
  expect( roverGroupInput ).toBeInTheDocument();
  expect( addGroupBtn ).toBeInTheDocument();

} );

test( "sets the values & submit the form", () => {
  server.use(
    rest.post( "http://localhost:8080/graphql", ( req, res, ctx ) => {
      return res(ctx.status(200), ctx.json(addGroupData));
    })
  );
  const { container } = render(
    <MemoryRouter>
      <BreadcrumbContextProvider>
        <Form />
      </BreadcrumbContextProvider>
    </MemoryRouter>
  );

  const groupNameInput = screen.getByLabelText(/Group Name/i);
  const roverGroupInput = screen.getByPlaceholderText(
    /Enter the Rover\/LDAP common name.../i
  );
  const addGroupBtn = screen.getByRole( "button", { type: "submit" } );
  userEvent.type( groupNameInput, "One Platform Developers Test" );
  userEvent.type( roverGroupInput, "one-platform-test" );
  userEvent.click( addGroupBtn, undefined, { skipPointerEventsCheck: true } );

  expect(container).toBeInTheDocument();
});
