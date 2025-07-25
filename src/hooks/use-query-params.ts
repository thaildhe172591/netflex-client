import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useQueryParams = <
  T extends Record<string, string | number | boolean | unknown>
>() => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = useMemo(() => {
    const query = new URLSearchParams();
    searchParams.forEach((value, key) => {
      query.append(key, value);
    });
    return query;
  }, [searchParams]);

  const setQueryParam = <K extends keyof T>(name: K, value: T[K]) => {
    queryParam.set(String(name), String(value));
    router.replace(`?${queryParam}`, { scroll: false });
  };

  const getQueryParam = <K extends keyof T>(name: K): T[K] | undefined => {
    const value = queryParam.get(String(name));
    if (value === null) return undefined;

    return value as T[K];
  };

  return {
    queryParam,
    setQueryParam,
    getQueryParam,
  };
};
