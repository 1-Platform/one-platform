import openApiDiff from 'openapi-diff';
import { OpenAPIDiff } from './types';

export const diffOpenAPI = async (oldSpec: string, newSpec: string): Promise<OpenAPIDiff> => {
  const diff = await openApiDiff.diffSpecs({
    sourceSpec: { content: oldSpec, location: 'source.json', format: 'auto-detect' as any },
    destinationSpec: {
      content: newSpec,
      location: 'destination.json',
      format: 'auto-detect' as any,
    },
  });
  const nonBreakingDiff: any[] = [];
  const breakingDiff: any[] = [];

  diff.nonBreakingDifferences.forEach(
    ({ action, entity, sourceSpecEntityDetails, destinationSpecEntityDetails }) => {
      sourceSpecEntityDetails.forEach(({ location }) => {
        nonBreakingDiff.push({
          action,
          entity: entity.split('.').join(' > '),
          source: location.split('.').join(' > '),
          destination: '-',
        });
      });
      destinationSpecEntityDetails.forEach(({ location }) => {
        nonBreakingDiff.push({
          action,
          entity: entity.split('.').join(' > '),
          destination: location.split('.').join(' > '),
          source: '-',
        });
      });
    },
  );

  diff.unclassifiedDifferences.forEach(
    ({ action, entity, sourceSpecEntityDetails, destinationSpecEntityDetails }) => {
      sourceSpecEntityDetails.forEach(({ location }) => {
        nonBreakingDiff.push({
          action,
          entity: entity.split('.').join(' > '),
          source: location.split('.').join(' > '),
          destination: '-',
        });
      });
      destinationSpecEntityDetails.forEach(({ location }) => {
        nonBreakingDiff.push({
          action,
          entity: entity.split('.').join(' > '),
          destination: location.split('.').join(' > '),
          source: '-',
        });
      });
    },
  );

  if (diff.breakingDifferencesFound) {
    diff.breakingDifferences.forEach(
      ({ action, entity, sourceSpecEntityDetails, destinationSpecEntityDetails }) => {
        sourceSpecEntityDetails.forEach(({ location }) => {
          breakingDiff.push({
            action,
            entity: entity.split('.').join(' > '),
            source: location.split('.').join(' > '),
            destination: '-',
          });
        });
        destinationSpecEntityDetails.forEach(({ location }) => {
          breakingDiff.push({
            action,
            entity: entity.split('.').join(' > '),
            destination: location.split('.').join(' > '),
            source: '-',
          });
        });
      },
    );
  }

  const hasChanged = Boolean(breakingDiff.length) || Boolean(nonBreakingDiff.length);
  return { hasChanged, breakingDiff, nonBreakingDiff };
};
