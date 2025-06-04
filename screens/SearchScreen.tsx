import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
  StatusBar
} from 'react-native';
import { debounce } from 'lodash';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

import { API_KEY, BASE_URL, SearchResult } from '../types/content';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { EmptyState } from '../components/EmptyState';
import SearchBar from '../components/screens/search/SearchBar';
import SearchResultItem from '../components/screens/search/SearchResultItem';

const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
    navigation.navigate('Details', {
      id: item.id,
      type: item.media_type,
      content: item
    });
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      );
    }
    
    if (query.length === 0) {
      return (
        <EmptyState 
          icon="search"
          title="Search for movies & TV shows"
          subtitle="Find your favorite content"
        />
      );
    }
    
    if (noResults) {
      return (
        <EmptyState
          icon="search-outline"
          title="No results found"
          subtitle="Try different keywords"
        />
      );
    }
    
    return results.length > 0 && (
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <SearchResultItem item={item} onPress={handleContentPress} />
        )}
        keyExtractor={(item) => `${item.media_type}-${item.id}`}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
      />
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <HeaderBackButton 
        title="Search"
        onBack={() => navigation.goBack()}
      />
      
      <SearchBar
        value={query}
        onChangeText={handleSearchInputChange}
        onClear={handleClearSearch}
      />
      
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default SearchScreen;