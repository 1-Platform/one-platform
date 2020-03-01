<% if (dbSupport) { %>import { <%= serviceClassName %> } from './schema';<% } -%>
import { RedisPubSub } from 'graphql-redis-subscriptions';
export const pubsub = new RedisPubSub();

const <%= serviceClassName %>_UPDATE = "<%= serviceClassName %>_UPDATE";

export const <%= resolverName %> = {
  Subscription: {
    // subscriptions
    updated<%= serviceClassName %>Data: {
      subscribe: () => pubsub.asyncIterator(<%= serviceClassName %>_UPDATE)
    },
  },
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
      return {message: 'PUT API for <%= serviceClassName %> microservice'};
    },
    delete(root: any, args: any, ctx: any) {
      return {message: 'DELETE API for <%= serviceClassName %> microservice'};
    },
  }
}
