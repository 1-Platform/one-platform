import { useEffect } from 'react';
import { useRecentVisit } from 'context/RecentVisitContext';
import { RecentVisitLog } from 'context/RecentVisitContext/types';

type Props = {
  isLoading: boolean;
  log: RecentVisitLog & { envSlug: string };
  onRemoveId?: string;
};

export const useRegisterRecentVisit = ({ isLoading, log, onRemoveId }: Props) => {
  const { handleAddNewLog, handleRemoveLog } = useRecentVisit();
  useEffect(() => {
    if (!isLoading) {
      if (log) {
        handleAddNewLog(log);
      } else if (onRemoveId) {
        handleRemoveLog(onRemoveId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, onRemoveId, log]);
};
