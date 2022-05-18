import 'graphql-import-node';

import { graphqlSchema, setupMongoose, startApolloServer } from './app';

(async function main() {
  await setupMongoose();
  await startApolloServer(graphqlSchema);
})();
