import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function useQueryParams() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams()
  );
  const location = useLocation();

  useEffect(() => {
    setSearchParams(new URLSearchParams(location.search));
  }, [location]);

  return searchParams;
}
