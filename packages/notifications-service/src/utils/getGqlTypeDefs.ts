import { gql } from 'apollo-server';
import { readFileSync } from 'fs';

export default function getGqlTypeDefs(module: string) {
  return gql(readFileSync(module, { encoding: 'utf-8' }));
}
