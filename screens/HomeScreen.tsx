import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, StatusBar, FlatList, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

import { API_KEY, BASE_URL, Movie, TvShow, ContentType } from '../types/content';
import { contentCategories } from '../components/screens/home/types';
import HomeHeader from '../components/screens/home/HomeHeader';
import FeaturedContent from '../components/screens/home/FeaturedContent';
import ContentSection from '../components/screens/home/ContentSection';
import Logo from '../components/Logo';
import homeScreenStyles from './homeScreenStyles';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredList, setFeaturedList] = useState<(Movie | TvShow)[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: (Movie | TvShow)[] }>({});

  useEffect(() => {
    fetchInitialContent();
  }, []);

  const fetchInitialContent = async () => {
    try {
      // Fetch trending content for the featured carousel
      const trendingResponse = await fetch(
        `${BASE_URL}/trending/all/day?api_key=${API_KEY}`
      );
      const trendingData = await trendingResponse.json();
      if (trendingData.results && trendingData.results.length > 0) {
        setFeaturedList(trendingData.results.slice(0, 10)); // Show top 10 in carousel
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
    <SafeAreaView style={homeScreenStyles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      {/* Header Row: Logo, Search, Profile */}
      <View style={homeScreenStyles.headerRow}>
        <Logo style={homeScreenStyles.logo} />
        <View style={homeScreenStyles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Search' as never)} style={homeScreenStyles.headerIcon}>
            <Text style={homeScreenStyles.headerIconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)} style={homeScreenStyles.headerIcon}>
            <Text style={homeScreenStyles.headerIconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={homeScreenStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Featured Carousel */}
        {featuredList.length > 0 && (
          <View style={homeScreenStyles.featuredCarouselContainer}>
            <FlatList
              data={featuredList}
              keyExtractor={item => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              renderItem={({ item }) => (
                <View style={homeScreenStyles.featuredCard}>
                  <FeaturedContent
                    content={item}
                    onPlayPress={() => handleContentPress(
                      item,
                      'title' in item ? 'movie' : 'tv'
                    )}
                    onInfoPress={() => handleContentPress(
                      item,
                      'title' in item ? 'movie' : 'tv'
                    )}
                  />
                </View>
              )}
            />
          </View>
        )}

        {/* Category Sections */}
        {contentCategories.map((category) => {
          const categoryData = categories[category.title] || [];
          return categoryData.length > 0 ? (
            <View key={category.title} style={homeScreenStyles.categorySection}>
              <View style={homeScreenStyles.categoryHeader}>
                <Text style={homeScreenStyles.categoryTitle}>{category.title}</Text>
                <TouchableOpacity>
                  <Text style={homeScreenStyles.chevron}>{'>'}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={categoryData}
                keyExtractor={item => String(item.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8 }}
                renderItem={({ item }) => (
                  <View style={homeScreenStyles.categoryCard}>
                    <ContentSection
                      title=""
                      data={[item]}
                      contentType={category.type}
                      onItemPress={handleContentPress}
                      hideTitle
                    />
                  </View>
                )}
              />
            </View>
          ) : null;
        })}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={homeScreenStyles.bottomNav}>
        <TouchableOpacity style={homeScreenStyles.navItem}>
          <Text style={homeScreenStyles.navIcon}>🏠</Text>
          <Text style={homeScreenStyles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeScreenStyles.navItem}>
          <Text style={homeScreenStyles.navIcon}>🔎</Text>
          <Text style={homeScreenStyles.navLabel}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeScreenStyles.navItem}>
          <Text style={homeScreenStyles.navIcon}>📚</Text>
          <Text style={homeScreenStyles.navLabel}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeScreenStyles.navItem}>
          <Text style={homeScreenStyles.navIcon}>👤</Text>
          <Text style={homeScreenStyles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};



export default HomeScreen;