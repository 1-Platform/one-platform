/* eslint-disable no-underscore-dangle */
import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { Types } from 'mongoose';
import { SubcribeSchemaArg } from 'graph/types';

export const SubscriptionResolvers: IExecutableSchemaDefinition<IContext>['resolvers'] = {
  Mutation: {
    async subscribeApiSchema(
      _parent,
      { config: { email, envIDs, namespaceID, schemaID } }: SubcribeSchemaArg,
      { dataSources: { namespaceDB, subscriptionDB }, user },
    ) {
      if (!user.id) {
        throw Error('Unauthorized Access');
      }

      const nsDoc = await namespaceDB.getANamespaceById(namespaceID);
      if (!nsDoc) {
        throw Error('Namespace not found');
      }

      const schema = nsDoc.schemas.find(({ id }: { id?: any }) => schemaID === id);
      if (!schema) {
        throw Error('Schema not found');
      }

      const envsSubscribed: Types.ObjectId[] = [];
      const lookUpTable = envIDs.reduce<Record<string, boolean>>(
        (prev, curr) => ({ ...prev, [curr]: true }),
        {},
      );
      schema.environments.forEach(({ id }: { id?: any }) => {
        if (id && lookUpTable?.[id.toString()]) {
          envsSubscribed.push(new Types.ObjectId(id));
        }
      });
      if (envsSubscribed.length !== envIDs.length) {
        throw Error('Unknown environment id found');
      }

      await subscriptionDB.subscribeASchema({
        email,
        envrionmentIDs: envsSubscribed,
        namespaceID: nsDoc.id,
        schemaID: new Types.ObjectId(schema.id),
      });

      return nsDoc.toObject({ virtuals: true });
    },
  },
};
