import { PaginationRequest } from "@/models/pagination";
import { Actor } from "./actor";

export interface Episode {
  id: number;
  serieId: number;
  name: string;
  overview?: string;
  airDate?: Date;
  episodeNumber?: number;
  seasonNumber?: number;
  videoUrl?: string;
  runtime?: number;
}

export interface EpisodeDetail extends Episode {
  seriesName?: string;
  posterPath?: string;
  videoUrl?: string;
  actors?: Actor[];
}

export interface CreateEpisodePayload {
  name: string;
  episodeNumber: number;
  overview?: string;
  video?: File;
  runtime?: number;
  airDate?: Date;
  seriesId: number;
  actors?: number[];
}

export interface UpdateEpisodePayload {
  name?: string;
  episodeNumber?: number;
  overview?: string;
  video?: File;
  runtime?: number;
  airDate?: Date;
  actors?: number[];
}

export interface EpisodeFilter extends PaginationRequest {
  seriesId?: number;
  search?: string;
  sortBy?: string;
}
