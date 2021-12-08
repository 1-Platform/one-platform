import opcBase from '@one-platform/opc-base';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { QuickLink, RecentVisitContextProps, RecentVisitLog } from './types';

type RecentVisit = { log: RecentVisitLog[] };

const RecentVisitContext = createContext<RecentVisitContextProps | Record<string, unknown>>({});

// get local storage log
const userInfo = opcBase.auth?.getUserInfo();
const key = `api-catalog-recent-visits:${userInfo}`;

export const RecentVisitProvider: React.FC = ({ children }) => {
  const jsonSavedLog = localStorage.getItem(key);
  const savedLog = jsonSavedLog ? (JSON.parse(jsonSavedLog) as RecentVisit) : { log: [] };

  // load it up
  const [recentVisit, setRecentVisit] = useState<RecentVisitLog[]>(savedLog?.log);
  const [quickLink, setQuickLink] = useState<QuickLink | null>(null);

  const saveToLocalStorage = useCallback((log: RecentVisitLog[]) => {
    const jsonLog = JSON.stringify({ log });
    localStorage.setItem(key, jsonLog);
  }, []);

  const handleAddNewLog = useCallback(
    (log: RecentVisitLog) => {
      // save recent visit to quick link
      setQuickLink({ id: log.id, name: log.title });

      const newState = recentVisit.filter(({ url }) => log.url !== url).slice(0, 4);
      // save to localstorage and  state
      newState.unshift(log);
      setRecentVisit(newState);
      saveToLocalStorage(newState);
    },
    [recentVisit, saveToLocalStorage]
  );

  const handleRemoveLog = useCallback(
    (logId: string) => {
      const newState = recentVisit.filter(({ id }) => id !== logId);
      setRecentVisit(newState);
      saveToLocalStorage(newState);
    },
    [recentVisit, saveToLocalStorage]
  );

  /**
   * Context value to access glabally from anywhere
   * Memo to optimize at best
   */
  const value = useMemo(
    () => ({
      logs: recentVisit,
      handleAddNewLog,
      handleRemoveLog,
      quickLink,
    }),

    [recentVisit, handleAddNewLog, quickLink, handleRemoveLog]
  );

  return <RecentVisitContext.Provider value={value}>{children}</RecentVisitContext.Provider>;
};

export const useRecentVisit = (): RecentVisitContextProps =>
  useContext(RecentVisitContext) as RecentVisitContextProps;
