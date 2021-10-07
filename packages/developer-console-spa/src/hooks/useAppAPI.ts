import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { appByAppId } from "../utils/gql-queries/app-by-appid";
import gqlClient from "../utils/gqlClient";
import { App } from "types";

export default function useAppAPI(appId: string): {
  app: App;
  loading: boolean;
  setApp: Dispatch<SetStateAction<any>>;
} {
  const [app, setApp] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);

    gqlClient({ query: appByAppId, variables: { appId } }, signal).then(
      (res) => {
        if (!res?.data?.app) {
          setLoading(false);
          return;
        }
        setApp(res.data.app);
        setLoading(false);
      }
    );

    return () => abortController.abort();
  }, [appId]);

  return { app, loading, setApp };
}
