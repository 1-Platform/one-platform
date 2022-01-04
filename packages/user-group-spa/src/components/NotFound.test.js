import React from 'react';
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import NotFound from "./NotFound";
import BreadcrumbContextProvider from "../context/BreadcrumbContext";

test( 'renders 404 page', async () => {

  const { getByText, container } = render(
    <MemoryRouter>
      <BreadcrumbContextProvider>
        <NotFound />
      </BreadcrumbContextProvider>
    </MemoryRouter>
  );

  const notFound = getByText(/Page Not Found/i);
  const linkToHome = getByText(/User Group Home/i);

  expect(container).toBeInTheDocument();
  expect(notFound).toBeInTheDocument();
  expect(linkToHome).toBeInTheDocument();
} );
