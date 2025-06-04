import { ContentItem, ContentType } from '../../../types/content';

export type ContentCategory = {
  title: string;
  endpoint: string;
  type: ContentType;
};

export const contentCategories: ContentCategory[] = [
  { title: 'Trending Movies', endpoint: '/trending/movie/week', type: 'movie' },
  { title: 'Popular TV Shows', endpoint: '/tv/popular', type: 'tv' },
  { title: 'Top Rated Movies', endpoint: '/movie/top_rated', type: 'movie' },
  { title: 'Action Movies', endpoint: '/discover/movie?with_genres=28', type: 'movie' },
  { title: 'Comedy TV Shows', endpoint: '/discover/tv?with_genres=35', type: 'tv' }
];

export type ContentSectionProps = {
  title: string;
  data: ContentItem[];
  contentType: ContentType;
  onItemPress: (content: ContentItem, type: ContentType) => void;
};
