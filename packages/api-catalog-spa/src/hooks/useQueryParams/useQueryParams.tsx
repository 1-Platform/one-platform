import { useLocation } from 'react-router-dom';

export const useQueryParams = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
};
