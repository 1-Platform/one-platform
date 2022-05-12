import { buildClientSchema } from 'graphql';
import { Change, CriticalityLevel, diff as gqlDifference } from '@graphql-inspector/core';
import { GraphqlDiff } from './types';

export const partitionByCriticalLevel = (changes: Change[]): Omit<GraphqlDiff, 'hasChanged'> => {
  const breakingDiff: GraphqlDiff['breakingDiff'] = [];
  const nonBreakingDiff: GraphqlDiff['breakingDiff'] = [];
  const dangerous: GraphqlDiff['breakingDiff'] = [];
  changes.forEach(({ criticality, message, type, path: apiPath }) => {
    if (criticality.level === CriticalityLevel.Breaking) {
      breakingDiff.push({ message, type, path: apiPath });
    } else if (criticality.level === CriticalityLevel.NonBreaking) {
      nonBreakingDiff.push({ message, type, path: apiPath });
    } else if (criticality.level === CriticalityLevel.Dangerous) {
      dangerous.push({ message, type, path: apiPath });
    }
  });

  return { breakingDiff, nonBreakingDiff, dangerous };
};

export const diffGraphql = async (oldSpec: string, newSpec: string): Promise<GraphqlDiff> => {
  const oldIntrospectionResult = JSON.parse(oldSpec).data;
  const oldGraphqlSchema = buildClientSchema(oldIntrospectionResult);
  const newIntrospectionResult = JSON.parse(newSpec).data;
  const newGraphqlSchema = buildClientSchema(newIntrospectionResult);
  const diff = await gqlDifference(oldGraphqlSchema, newGraphqlSchema);

  const changes = partitionByCriticalLevel(diff);
  const hasChanged =
    Boolean(changes.breakingDiff.length) ||
    Boolean(changes.dangerous.length) ||
    Boolean(changes.nonBreakingDiff.length);

  return { ...changes, hasChanged };
};
