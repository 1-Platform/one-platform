export default function prepareList (list: any[], filteredList: any[], first: number, after: number) {
  const totalCount = list.length;
  const startCursor = after;
  const endCursor = Math.min(after + filteredList.length - 1, totalCount - 1);
  const hasNextPage = endCursor < totalCount - 1;

  return {
    totalCount,
    pageInfo: {
      startCursor,
      endCursor,
      hasNextPage,
    }
  }
}
