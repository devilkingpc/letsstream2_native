export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  vote_count?: number;
};

export type TvShow = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  first_air_date: string;
  genres?: { id: number; name: string }[];
  episode_run_time?: number[];
  number_of_seasons?: number;
  vote_count?: number;
};

export type ContentType = 'movie' | 'tv';
export type ContentItem = Movie | TvShow;

export type SearchResult = ContentItem & {
  media_type: ContentType;
};

export const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
