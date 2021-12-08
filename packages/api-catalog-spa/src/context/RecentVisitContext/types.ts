export type RecentVisitLog = {
  title: string;
  tool: string;
  url: string;
  id: string;
};

export type QuickLink = {
  id: string;
  name: string;
};

export type RecentVisitContextProps = {
  logs: RecentVisitLog[];
  handleAddNewLog: (log: RecentVisitLog) => void;
  handleRemoveLog: (logId: string) => void;
  quickLink: QuickLink;
};
