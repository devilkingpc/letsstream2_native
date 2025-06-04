import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

import { API_KEY, BASE_URL, Movie, TvShow, ContentType } from '../types/content';
import { contentCategories } from '../components/screens/home/types';
import HomeHeader from '../components/screens/home/HomeHeader';
import FeaturedContent from '../components/screens/home/FeaturedContent';
import ContentSection from '../components/screens/home/ContentSection';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredContent, setFeaturedContent] = useState<Movie | TvShow | null>(null);
  const [categories, setCategories] = useState<{ [key: string]: (Movie | TvShow)[] }>({});

  useEffect(() => {
    fetchInitialContent();
  }, []);

  const fetchInitialContent = async () => {
    try {
      // Fetch trending content for the hero section
      const trendingResponse = await fetch(
        `${BASE_URL}/trending/all/day?api_key=${API_KEY}`
      );
      const trendingData = await trendingResponse.json();
      
      if (trendingData.results && trendingData.results.length > 0) {
        setFeaturedContent(trendingData.results[0]);
      }
      
      // Fetch all category content in parallel
      const categoryPromises = contentCategories.map(category => 
        fetch(`${BASE_URL}${category.endpoint}&api_key=${API_KEY}`)
          .then(res => res.json())
          .then(data => ({ title: category.title, data: data.results, type: category.type }))
      );
      
      const categoryResults = await Promise.all(categoryPromises);
      const categoriesData: { [key: string]: (Movie | TvShow)[] } = {};
      
      categoryResults.forEach(result => {
        categoriesData[result.title] = result.data;
      });
      
      setCategories(categoriesData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setIsLoading(false);
    }
  };

  const handleContentPress = (content: Movie | TvShow, contentType: ContentType) => {
    navigation.navigate('Details', { 
      id: content.id, 
      type: contentType,
      content
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <HomeHeader
        onSearchPress={() => navigation.navigate('Search' as never)}
        onProfilePress={() => navigation.navigate('Profile' as never)}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {featuredContent && (
          <FeaturedContent
            content={featuredContent}
            onPlayPress={() => handleContentPress(
              featuredContent, 
              'title' in featuredContent ? 'movie' : 'tv'
            )}
            onInfoPress={() => handleContentPress(
              featuredContent,
              'title' in featuredContent ? 'movie' : 'tv'
            )}
          />
        )}

        {contentCategories.map((category) => {
          const categoryData = categories[category.title] || [];
          return categoryData.length > 0 ? (
            <ContentSection
              key={category.title}
              title={category.title}
              data={categoryData}
              contentType={category.type}
              onItemPress={handleContentPress}
            />
          ) : null;
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;