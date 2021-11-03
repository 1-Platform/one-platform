import { NamespaceStat } from 'graphql/namespace/types';

export type NamespaceCountTemplate = {
  type: string;
  image: string;
  key: keyof NamespaceStat;
};

export enum SortBy {
  RECENTLY_ADDED = 'Recently added',
  RECENTLY_MODIFIED = 'Date modified',
}
