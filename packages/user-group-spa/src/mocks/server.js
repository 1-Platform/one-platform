// src/mocks/server.js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
//const handlers = [];
// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);
