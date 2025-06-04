import { Movie, TvShow, ContentType } from './content';

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Details: {
    id: number;
    type: ContentType;
    content?: Movie | TvShow;
  };
  Player: {
    id: number;
    type: ContentType;
    title?: string;
    sourceUrl: string;    sources: Array<{
      key: string; // matches our VideoSource interface
      name: string;
      movieUrlPattern: string;
      tvUrlPattern: string;
    }>;
    season?: number;
    episode?: number;
    seasonsData?: Array<{
      season_number: number;
      episode_count: number;
    }>;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
