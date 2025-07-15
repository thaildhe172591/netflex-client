import { useQuery } from "@tanstack/react-query";
import { actorApi } from "@/lib/api-client";
import { Actor, ActorFilter} from "@/models";
import { QueryKeys } from "@/constants";

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

export const useActorDetail = (
  actorId: string,
  options: ActorQueryOptions = {}
) =>
  useQuery<Actor, Error>({
    ...options,
    queryKey: [QueryKeys.ACTORS, actorId],
    queryFn: () => actorApi.get(actorId),
  });
