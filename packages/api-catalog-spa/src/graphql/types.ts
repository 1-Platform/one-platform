export type Pagination<T extends unknown> = {
  count: number;
  data: T;
};
