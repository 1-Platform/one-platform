import { useEffect, useState } from "react";
import { appFeedbackConfig } from "../utils/gql-queries";
import gqlClient from "../utils/gqlClient";

export default function useFeedbackConfig(appId: string): {
  feedbackConfig: error;
  setFeedbackConfig: error;
  loading: error;
} {
  const [feedbackConfig, setFeedbackConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appId) {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);

    gqlClient({ query: appFeedbackConfig, variables: { appId } }, signal)
      .then((res) => {
        if (!res || !res.data) {
          setLoading(false);
          return;
        }
        setFeedbackConfig(res.data.app?.feedback ?? {});
        setLoading(false);
      })
      .catch((err) => {
        window.OpNotification?.danger({
          subject: "There was some error fetching feedback configuration.",
          body: "Please try again later.",
        });
      });

    return () => abortController.abort();
  }, [appId]);

  return { feedbackConfig, setFeedbackConfig, loading };
}
