import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client/axios-client";
import { QueryKeys } from "@/constants";

interface Country {
  iso_3166_1: string;
  english_name: string;
}

export function useCountries() {
  return useQuery<Country[]>({
    queryKey: [QueryKeys.COUNTRIES],
    queryFn: async () => {
      const response = await apiClient.get("/countries");
      return response.data;
    },
  });
}
