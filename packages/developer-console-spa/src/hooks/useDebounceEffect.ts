import { useEffect } from "react";

export default function useDebounceEffect(
  effect: () => any,
  deps: any[],
  delay = 1000
) {
  useEffect(() => {
    let cleanup: any;

    const handler = setTimeout(() => {
      cleanup = effect();
    }, delay);

    return () => {
      clearTimeout(handler);
      return cleanup;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
