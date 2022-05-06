import { IResolvers } from '@graphql-tools/utils';
import { UserInputError } from 'apollo-server';
import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId } from 'mongodb';

const CommonResolver: IResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime scalar for parsing and serializing DateTime objects',
    serialize: (value: any) => {
      return value.toISOString(); // Convert outgoing Date to ISO String for JSON
    },
    parseValue: (value: any) => {
      if (isNaN(Date.parse(value))) {
        throw new UserInputError('Invalid date format');
      }
      return new Date(value); // Convert incoming string | integer to Date
    },
    parseLiteral: (ast) => {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
      } else if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      throw new UserInputError('Invalid date format'); // Invalid hard-coded value (not an integer)
    },
  }),
  ObjectId: new GraphQLScalarType({
    name: 'ObjectId',
    description: 'MongoDB ObjectID',
    serialize: (value: any) => {
      return value.toString();
    },
    parseValue: (value: any) => {
      if (ObjectId.isValid(value)) {
        return new ObjectId(value);
      }
      throw new UserInputError('Invalid ObjectID');
    },
    parseLiteral: (ast) => {
      if (ast.kind === Kind.STRING && ObjectId.isValid(ast.value)) {
        return new ObjectId(ast.value);
      }
      throw new UserInputError('Invalid ObjectId');
    },
  }),
};

export default CommonResolver;
