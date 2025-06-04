import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IMAGE_BASE_URL } from '../../../types/content';
import type { SearchResult, Movie, TvShow } from '../../../types/content';

type SearchResultItemProps = {
  item: SearchResult;
  onPress: (item: SearchResult) => void;
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, onPress }) => {  const isMovie = item.media_type === 'movie';
  const title = isMovie 
    ? (item as Movie & { media_type: 'movie' }).title
    : (item as TvShow & { media_type: 'tv' }).name || 'Unknown';
  const releaseDate = isMovie
    ? (item as Movie & { media_type: 'movie' }).release_date
    : (item as TvShow & { media_type: 'tv' }).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const posterPath = item.poster_path 
    ? `${IMAGE_BASE_URL}${item.poster_path}`
    : 'https://via.placeholder.com/120x180/333333/FFFFFF?text=No+Image';
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
    >
      <Image
        source={{ uri: posterPath }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.typeBadge}>
              {item.media_type === 'movie' ? 'Movie' : 'TV'}
            </Text>
            {item.vote_average > 0 && (
              <View style={styles.rating}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>{item.vote_average.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </View>
        {year && <Text style={styles.year}>{year}</Text>}
        <Text style={styles.overview} numberOfLines={2}>
          {item.overview || 'No description available.'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: 80,
    height: 120,
  },
  details: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  typeBadge: {
    color: '#fff',
    backgroundColor: '#E50914',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 4,
  },
  year: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
  },
  overview: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 18,
  },
});

export default SearchResultItem;
