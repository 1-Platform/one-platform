import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(url, { signal })
    .then(res => res.json())
    .then( (res) => {
      setData(res);
      setIsPending(false);
    })
    .catch( err => {
      if (err.name === 'AbortError') {
        console.error('Fetch Aborted!');
      } else {
        setIsPending(false);
        setError(err.name);
      }
    });
    return () => abortController.abort();
  }, [url]);
  return {
    data,
    isPending,
    error
  };
};

export default useFetch;
