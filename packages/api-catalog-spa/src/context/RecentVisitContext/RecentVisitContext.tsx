import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { QuickLink, RecentVisitContextProps, RecentVisitLog } from './types';

const RecentVisitContext = createContext<RecentVisitContextProps | Record<string, unknown>>({});

type Props = {
  children: ReactNode;
};

// one week
const TTL = 7 * 86400000;

const getKey = () => {
  // get local storage log
  const userInfo = window.OpAuthHelper?.getUserInfo();

  return `api-catalog-recent-visits:${userInfo?.rhatUUID}`;
};

const loadFromLocalStorage = () => {
  const key = getKey();
  const jsonSavedLog = localStorage.getItem(key);
  if (!jsonSavedLog) {
    return [];
  }

  const data = JSON.parse(jsonSavedLog);
  const now = new Date();

  if (now.getTime() > data.expiry) {
    localStorage.removeItem(key);
    return [];
  }
  return data.log;
};

const saveToLocalStorage = (log: RecentVisitLog[]) => {
  const key = getKey();
  const now = new Date();
  const jsonLog = JSON.stringify({ log, expiry: now.getTime() + TTL });
  localStorage.setItem(key, jsonLog);
};

export const RecentVisitProvider = ({ children }: Props): JSX.Element => {
  // load it up
  const [recentVisit, setRecentVisit] = useState<RecentVisitLog[]>([]);
  const [quickLink, setQuickLink] = useState<QuickLink | null>(null);
  useEffect(() => {
    window.OpAuthHelper?.onLogin(() => {
      setRecentVisit(loadFromLocalStorage());
    });
  }, []);

  const handleAddNewLog = useCallback(
    ({ envSlug, ...log }: RecentVisitLog & { envSlug: string }) => {
      // save recent visit to quick link
      setQuickLink({ id: log.id, name: log.title, envSlug });

      const newState = recentVisit.filter(({ url }) => log.url !== url).slice(0, 4);
      // save to localstorage and  state
      newState.unshift(log);
      setRecentVisit(newState);
      saveToLocalStorage(newState);
    },
    [recentVisit]
  );

  const handleRemoveLog = useCallback(
    (logId: string) => {
      const newState = recentVisit.filter(({ id }) => id !== logId);
      setRecentVisit(newState);
      saveToLocalStorage(newState);
    },
    [recentVisit]
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
