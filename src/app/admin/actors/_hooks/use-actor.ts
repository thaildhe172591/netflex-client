import { useQuery } from "@tanstack/react-query";
import { actorApi } from "@/lib/api-client/actor-api";
import { QueryKeys } from "@/constants";
import { ActorFilter } from "@/models/actor";

type ActorQueryOptions = Omit<unknown, "queryKey" | "queryFn">;

export const useActors = (
  request: ActorFilter,
  options: ActorQueryOptions = {}
) =>
  useQuery({
    ...options,
    queryKey: [QueryKeys.ACTORS, request],
    queryFn: () => actorApi.getAll(request),
  });
