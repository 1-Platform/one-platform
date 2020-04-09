// write your helper functions here
import { RedisPubSub } from 'graphql-redis-subscriptions';
export const pubsub = new RedisPubSub();
import { config as configuration } from "./config/config";

export const getTransporterInstance = () => {
    return configuration.transporter;
  };

  export const getEnvironmentPaths = () => {
    // Setting Environment
    // tslint:disable-next-line:triple-equals
    if (!process.env.NODE_ENV || process.env.NODE_ENV == "undefined") {
      process.env.NODE_ENV = "local";
    }
    const environment = process.env.NODE_ENV;
    return configuration.paths.filter((object: any) => {
      return object.name === environment;
    })[0];
  };
  