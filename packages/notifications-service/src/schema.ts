import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolve } from 'path';
import getGqlTypeDefs from '@utils/getGqlTypeDefs';
import NotificationResolver from '@modules/Notification/resolver';
import SubscriberResolver from '@modules/Subscriber/resolver';
import BannerResolver from '@modules/Banner/resolver';
import CommonResolver from '@modules/common/resolver';

export default makeExecutableSchema({
  typeDefs: [
    getGqlTypeDefs(resolve(__dirname, 'modules/common/typedef.gql')),
    getGqlTypeDefs(resolve(__dirname, 'modules/Notification/typedef.gql')),
    getGqlTypeDefs(resolve(__dirname, 'modules/Subscriber/typedef.gql')),
    getGqlTypeDefs(resolve(__dirname, 'modules/Banner/typedef.gql')),
  ],
  resolvers: [
    CommonResolver,
    NotificationResolver,
    SubscriberResolver,
    BannerResolver,
  ],
});
