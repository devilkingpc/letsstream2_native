import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  StatusBar
} from 'react-native';
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// TMDB API constants
const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

type SearchResult = {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
};

const SearchScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  
  const searchContent = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setNoResults(false);
      return;
    }
    
    setIsLoading(true);
    setNoResults(false);
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=false`
      );
      const data = await response.json();
      
      // Filter out person results and other non-movie/tv items
      const filteredResults = data.results.filter((item: any) => 
        item.media_type === 'movie' || item.media_type === 'tv'
      );
      
      setResults(filteredResults);
      setNoResults(filteredResults.length === 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Error searching content:', error);
      setResults([]);
      setIsLoading(false);
    }
  };
  
  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((text: string) => searchContent(text), 500),
    []
  );
  
  const handleSearchInputChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };
  
  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setNoResults(false);
    Keyboard.dismiss();
  };
  
  const handleContentPress = (item: SearchResult) => {
    // Navigate to details screen with the item data
    navigation.navigate('Details' as never, {
      id: item.id,
      type: item.media_type,
      content: item
    } as never);
  };
  
  const renderNoResults = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={60} color="#555" />
      <Text style={styles.emptyText}>No results found</Text>
      <Text style={styles.emptySubText}>Try different keywords</Text>
    </View>
  );
  
  const renderInitialState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={60} color="#555" />
      <Text style={styles.emptyText}>Search for movies & TV shows</Text>
      <Text style={styles.emptySubText}>Find your favorite content</Text>
    </View>
  );
  
  const renderSearchItem = ({ item }: { item: SearchResult }) => {
    const title = item.title || item.name || 'Unknown';
    const releaseDate = item.release_date || item.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
    const posterPath = item.poster_path 
      ? `${IMAGE_BASE_URL}${item.poster_path}`
      : 'https://via.placeholder.com/120x180/333333/FFFFFF?text=No+Image';
    
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleContentPress(item)}
      >
        <Image
          source={{ uri: posterPath }}
          style={styles.posterImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.typeBadge}>
                {item.media_type === 'movie' ? 'Movie' : 'TV'}
              </Text>
              {item.vote_average > 0 && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.vote_average.toFixed(1)}</Text>
                </View>
              )}
            </View>
          </View>
          {year && <Text style={styles.itemYear}>{year}</Text>}
          <Text style={styles.itemOverview} numberOfLines={2}>
            {item.overview || 'No description available.'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Movies, TV shows..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={handleSearchInputChange}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : (
        <>
          {query.length === 0 && renderInitialState()}
          
          {noResults && query.length > 0 && renderNoResults()}
          
          {results.length > 0 && (
            <FlatList
              data={results}
              renderItem={renderSearchItem}
              keyExtractor={(item) => `${item.media_type}-${item.id}`}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  posterImage: {
    width: 80,
    height: 120,
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitle: {
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 4,
  },
  itemYear: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
  },
  itemOverview: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 18,
  },
});

export default SearchScreen;