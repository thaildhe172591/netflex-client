import { Genre } from "./genre";
import { Keyword } from "./keyword";
import { PaginationRequest } from "./pagination";

export interface Serie {
  id: number;
  name: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  countryIso?: string;
  firstAirDate?: Date;
  lastAirDate?: Date;
}

export interface SerieDetail extends Serie {
  genres?: Genre[];
  keywords?: Keyword[];
}

export interface CreateSeriePayload {
  name: string;
  overview?: string;
  poster?: File;
  backdrop?: File;
  countryIso?: string;
  firstAirDate?: Date;
  lastAirDate?: Date;
  keywords?: number[];
  genres?: number[];
}

export interface UpdateSeriePayload {
  name?: string;
  overview?: string;
  poster?: File;
  backdrop?: File;
  countryIso?: string;
  firstAirDate?: Date;
  lastAirDate?: Date;
  keywords?: number[];
  genres?: number[];
}

export interface SerieFilter extends PaginationRequest {
  search?: string;
  genres?: number[];
  keywords?: number[];
  sortBy?: string;
  country?: string;
  year?: string;
}
