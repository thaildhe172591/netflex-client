import { PaginationRequest } from "@/models/pagination";
import { Actor } from "./actor";

export interface Episode {
  id: string;
  seriesId: string;
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
  seriesId: string;
  actors?: string[];
}

export interface UpdateEpisodePayload {
  name?: string;
  episodeNumber?: number;
  overview?: string;
  video?: File;
  runtime?: number;
  airDate?: Date;
  actors?: string[];
}

export interface EpisodeFilter extends PaginationRequest {
  seriesId?: string;
  search?: string;
  sortBy?: string;
}
