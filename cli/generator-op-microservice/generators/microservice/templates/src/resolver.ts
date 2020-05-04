<% if (dbSupport) { %>import { <%= serviceClassName %> } from './schema';<% } -%>

export const <%= resolverName %> = {
  Query: {
    // queries
    list(root: any, args: any, ctx: any) {
      return [{message: 'GET API for <%= serviceClassName %> microservice'}];
    },
    get(root: any, args: any, ctx: any) {
      // fetch the id from args.id
      return {message: 'GET by ID API for <%= serviceClassName %> microservice'};
    }
  },
  Mutation: {
    // mutations
    create(root: any, args: any, ctx: any) {
      return {message: 'POST API for <%= serviceClassName %> microservice'};
    },
    update(root: any, args: any, ctx: any) {
      /* Optional: if you want to send graphql subscription updates when this query is called) */
      // pubsub.publish(<%= serviceClassName %>_UPDATE, data);
      return {message: 'PUT API for <%= serviceClassName %> microservice'};
    },
    delete(root: any, args: any, ctx: any) {
      return {message: 'DELETE API for <%= serviceClassName %> microservice'};
    },

  }
}
