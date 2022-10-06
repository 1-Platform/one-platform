import { GraphQLError } from 'graphql';

export const ErrUnauthorizedAccess = new GraphQLError('Unauthorized access', {
  extensions: { code: 'FORBIDDEN' },
});
