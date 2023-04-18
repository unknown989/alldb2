import { ReactElement, useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  const component = useMemo(() => {
    if (isLoading) return <Loading />;
    else return <></>;
  }, [isLoading]);

  return [
    (): JSX.Element => component,
    (v: boolean) => {
      setIsLoading(v);
    },
  ];
}
