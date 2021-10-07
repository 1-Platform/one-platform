import { useEffect, useState } from "react";
import { myApps } from "../utils/gql-queries";
import gqlClient from "../utils/gqlClient";
import { App } from "types";

export default function useMyAppsAPI(): { apps: App[]; loading: boolean } {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    gqlClient({ query: myApps }, signal).then((res) => {
      if (!res || !res.data) {
        setLoading(false);
        return;
      }
      setApps(res.data.myApps);
      setLoading(false);
    });

    return () => abortController.abort();
  }, []);

  return { apps, loading };
}
