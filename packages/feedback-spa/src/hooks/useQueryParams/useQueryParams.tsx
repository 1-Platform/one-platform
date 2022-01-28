import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useQueryParams = (): URLSearchParams => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};
