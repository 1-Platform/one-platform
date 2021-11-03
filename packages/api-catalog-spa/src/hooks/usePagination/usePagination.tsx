import { useCallback, useState } from 'react';

type Props = {
  // initial state
  page?: number;
  perPage?: number;
};

type UsePaginationReturn = {
  pagination: Required<Props>;
  onSetPage: (page: number) => void;
  onPerPageSelect: (perPage: number) => void;
  onResetPagination: () => void;
};

export const usePagination = ({ page = 1, perPage = 20 }: Props): UsePaginationReturn => {
  const [pagination, setPagination] = useState({ page, perPage });

  const onSetPage = useCallback((pageNumber: number): void => {
    setPagination((state) => ({ ...state, page: pageNumber }));
  }, []);

  const onPerPageSelect = useCallback((perPageSelected: number) => {
    setPagination((state) => ({ ...state, perPage: perPageSelected }));
  }, []);

  const onResetPagination = useCallback(() => {
    setPagination({ page, perPage });
  }, [page, perPage]);

  return {
    pagination,
    onSetPage,
    onPerPageSelect,
    onResetPagination,
  };
};
