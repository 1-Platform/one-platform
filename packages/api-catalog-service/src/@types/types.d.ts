declare module '*.graphql';
declare module '*.json';

/*
 * Global  Type Definitions.
 */
type ApiUserType = {
  cn?: string;
  mail?: string;
  uid?: string;
  rhatUUID?: string;
  rhatJobTitle?: string;
};
/*
 * Namespace Type Definitions.
 */

type Pagination<T extends unknown> = {
  count: number;
  data: T;
};
