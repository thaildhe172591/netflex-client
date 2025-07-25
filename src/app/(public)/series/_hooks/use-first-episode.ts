import { useQuery } from "@tanstack/react-query";
import { episodeApi } from "@/lib/api-client";
import { QueryKeys } from "@/constants";

export const useFirstEpisode = (serieId: number, enabled = true) => {
  return useQuery({
    queryKey: [QueryKeys.EPISODES, "serie", serieId],
    queryFn: () =>
      episodeApi.getAll({
        seriesId: serieId,
        pageIndex: 1,
        pageSize: 1,
        sortBy: "episode_number.asc",
      }),
    enabled: !!serieId && enabled,
    select: (data) => data.data[0],
  });
};
