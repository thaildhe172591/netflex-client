import { Genre } from "./genre";
import { Keyword } from "./keyword";
import { PaginationRequest } from "./pagination";

export interface CreateMoviePayload {
  title: string;
  overview?: string;
  poster?: File;
  backdrop?: File;
  video?: File;
  countryIso?: string;
  runtime?: number;
  releaseDate?: Date;
  actors?: number[];
  keywords?: number[];
  genres?: number[];
}

export interface UpdateMoviePayload {
  title?: string;
  overview?: string;
  poster?: File;
  backdrop?: File;
  video?: File;
  countryIso?: string;
  runtime?: number;
  releaseDate?: Date;
  actors?: number[];
  keywords?: number[];
  genres?: number[];
}

export interface MovieDetail extends Movie {
  actors?: number[];
  keywords?: Keyword[];
  genres?: Genre[];
}

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  videoUrl?: string;
  countryIso?: string;
  runtime?: number;
  releaseDate?: Date;
}

export interface MovieFilter extends PaginationRequest {
  search?: string;
  genres?: number[];
  keywords?: number[];
  actors?: number[];
  sortby?: string;
}
