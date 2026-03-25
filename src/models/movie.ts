import { Actor } from "./actor";
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
  actors?: Actor[];
  keywords?: Keyword[];
  genres?: Genre[];
}

export interface Movie {
  id: string;
  title: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  videoUrl?: string;
  countryIso?: string;
  runtime?: number;
  releaseDate?: Date;
  averageRating?: number;
  totalReviews?: number;
}

export interface MovieFilter extends PaginationRequest {
  search?: string;
  genres?: string[];
  keywords?: string[];
  actors?: string[];
  country?: string;
  year?: string;
  sortby?: string;
}
