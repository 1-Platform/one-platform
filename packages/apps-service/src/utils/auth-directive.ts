import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { ForbiddenError } from 'apollo-server';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

export default function authDirective(directiveName: string) {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return (schema: GraphQLSchema) => {
    return mapSchema(schema, {
      [MapperKind.TYPE]: type => {
        const authDirective = getDirective(schema, type, directiveName)?.[0];
        if (authDirective) {
          typeDirectiveArgumentMaps[type.name] = authDirective;
        }
        return undefined;
      },
      [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
        const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName];
        if (authDirective) {
          const { requires } = authDirective;
          if (requires) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = (source, args, ctx, info) => {
              const user = getUserFromContext(ctx);
              console.log({authDirective, ctx});
              if (!user.role.includes(requires) && requires !== 'USER') {
                throw new ForbiddenError('Not Authorized');
              }
              return resolve(source, args, ctx, info);
            }
            return fieldConfig;
          }
        }
      }
    });
  }
}

function getUserFromContext(context: IAppsContext) {
  /* TODO: Get User info from request / context */
  return {
    userId: context.userId,
    role: [] as string[]
  }
}
