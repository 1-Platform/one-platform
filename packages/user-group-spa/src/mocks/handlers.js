// src/mocks/handlers.js
import { rest } from "msw";

export const handlers = [
  // Handles a POST /login request
  rest.post("http://localhost:8080/graphql", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          listGroups: [
            {
              _id: "5fa96e8fe3eda5fdaab43e69",
              name: "DSAL Admins",
              cn: "exd-infra-ma-dsal",
              createdOn: "2020-11-09T16:30:08.020Z",
              updatedOn: "2021-07-30T10:03:53.077Z",
            },
          ],
        },
      })
    );
  }),
];
