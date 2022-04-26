import { NODE_ENV, TOKEN_EMAIL_FIELD, TOKEN_NAME_FIELD, TOKEN_USERNAME_FIELD, TOKEN_USER_ID_FIELD } from '@setup/env';
import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { decode } from 'jsonwebtoken';
import schema from './schema';

export const getServer = () => {
  /* Create GraphQL Server  */
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const userId = req.headers['x-op-user-id'];

      let roles = req.headers['x-op-user-roles']
      if (typeof roles === 'string') {
        roles = roles.split(',').map(role => role.trim());
      }

      const tokenHeader = req.headers['x-op-token'];
      const token = Array.isArray(tokenHeader) ? tokenHeader.join('') : tokenHeader;
      const decodedToken = token ? decode(token) : null;

      let user = {};
      if (!!decodedToken && typeof decodedToken !== 'string') {
        user = {
          id: decodedToken[TOKEN_USER_ID_FIELD],
          name: decodedToken[TOKEN_NAME_FIELD],
          username: decodedToken[TOKEN_USERNAME_FIELD],
          email: decodedToken[TOKEN_EMAIL_FIELD],
        };
      }

      return {
        userId,
        roles,
        token,
        user,
      };
    },
    plugins: [ApolloServerPluginInlineTrace()],
    debug: NODE_ENV !== 'production',
  });

  return server;
};
