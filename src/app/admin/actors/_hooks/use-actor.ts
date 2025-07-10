import { useQuery } from "@tanstack/react-query";
import { actorApi } from "@/lib/api-client/actor-api";
import { QueryKeys } from "@/constants";
import { ActorQueryable } from "@/models/actor";

type ActorQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useActors = (
  request: ActorQueryable,
  options: ActorQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [
      QueryKeys.ACTORS,
      request.pageIndex,
      request.pageSize,
      request.search,
      request.sortBy,
    ],
    queryFn: () => actorApi.getAll(request),
  });
