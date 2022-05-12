import { ApiCategory } from 'graph/types';
import { isValidGraphqlSchema } from './isValidGraphqlSchema';
import { isValidOpenAPI } from './isValidOpenAPI';

export const validateSpecSheet = async (spec: string, category: ApiCategory) => {
  if (category === ApiCategory.GRAPHQL) {
    if (!isValidGraphqlSchema(spec)) throw Error('Invalid graphql schema provided');
    return;
  }

  const isValidOpenAPISpec = await isValidOpenAPI(spec);
  if (!isValidOpenAPISpec) {
    throw Error('Invalid openapi spec provided');
  }
};
