type GQLRequestProps = {
  query: string;
  variables?: any;
  operationName?: any;
};

export default function gqlClient(
  { query, variables }: GQLRequestProps,
  signal?: AbortSignal
) {
  if (!signal) {
    const abortController = new AbortController();
    signal = abortController.signal;
    setTimeout(() => {
      abortController.abort();
    }, 5000);
  }

  return fetch(process.env.REACT_APP_API_GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.OpAuthHelper?.jwtToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    signal,
  })
    .then((res: any) => {
      if (!res.ok) {
        console.debug("[GQLClient]:" + res.statusText);
      }
      return res;
    })
    .then((res) => res.json())
    .catch((err: Error) => {
      if (err.name === "AbortError") {
        console.debug("[GQLClient]: Request aborted");
        return;
      }
      throw err;
    });
}
