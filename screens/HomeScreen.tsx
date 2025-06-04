import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// TMDB API constants
const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Types for content
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
};

type TvShow = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  first_air_date: string;
};

type ContentCategory = {
  title: string;
  endpoint: string;
  type: 'movie' | 'tv';
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [trendingNow, setTrendingNow] = useState<Movie[]>([]);
  const [featuredContent, setFeaturedContent] = useState<Movie | TvShow | null>(null);
  const [categories, setCategories] = useState<{ [key: string]: (Movie | TvShow)[] }>({});
  
  const contentCategories: ContentCategory[] = [
    { title: 'Trending Movies', endpoint: '/trending/movie/week', type: 'movie' },
    { title: 'Popular TV Shows', endpoint: '/tv/popular', type: 'tv' },
    { title: 'Top Rated Movies', endpoint: '/movie/top_rated', type: 'movie' },
    { title: 'Action Movies', endpoint: '/discover/movie?with_genres=28', type: 'movie' },
    { title: 'Comedy TV Shows', endpoint: '/discover/tv?with_genres=35', type: 'tv' }
  ];

  useEffect(() => {
    const fetchInitialContent = async () => {
      try {
        // Fetch trending content for the hero section
        const trendingResponse = await fetch(
          `${BASE_URL}/trending/all/day?api_key=${API_KEY}`
        );
        const trendingData = await trendingResponse.json();
        
        if (trendingData.results && trendingData.results.length > 0) {
          setTrendingNow(trendingData.results);
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

    fetchInitialContent();
  }, []);

  const handleContentPress = (content: Movie | TvShow, contentType: 'movie' | 'tv') => {
    // @ts-ignore - Navigation params will be handled in the navigator setup
    navigation.navigate('Details', { 
      id: content.id, 
      type: contentType,
      // Pass the content object to avoid an additional API call
      content
    });
  };

  const renderContentItem = ({ item, contentType }: { item: Movie | TvShow, contentType: 'movie' | 'tv' }) => {
    const title = contentType === 'movie' ? (item as Movie).title : (item as TvShow).name;
    
    return (
      <TouchableOpacity
        style={styles.contentItem}
        onPress={() => handleContentPress(item, contentType)}
      >
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/120x180/333333/FFFFFF?text=No+Image' }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.vote_average.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.contentTitle} numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategorySection = (title: string, data: (Movie | TvShow)[], contentType: 'movie' | 'tv') => {
    return (
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{title}</Text>
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${contentType}-${item.id}`}
          renderItem={({ item }) => renderContentItem({ item, contentType })}
          contentContainerStyle={styles.contentList}
        />
      </View>
    );
  };

  const renderFeaturedContent = () => {
    if (!featuredContent) return null;
    
    const isMovie = 'title' in featuredContent;
    const title = isMovie ? featuredContent.title : featuredContent.name;
    const releaseDate = isMovie 
      ? (featuredContent as Movie).release_date 
      : (featuredContent as TvShow).first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
    
    return (
      <View style={styles.featuredContainer}>
        <Image
          source={{ uri: featuredContent.backdrop_path ? `${IMAGE_BASE_URL}${featuredContent.backdrop_path}` : 'https://via.placeholder.com/500x281/333333/FFFFFF?text=No+Image' }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <View style={styles.featuredGradient} />
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>{title}</Text>
          <Text style={styles.featuredYear}>{year}</Text>
          <Text style={styles.featuredOverview} numberOfLines={2}>
            {featuredContent.overview}
          </Text>
          <View style={styles.featuredButtons}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => handleContentPress(featuredContent, isMovie ? 'movie' : 'tv')}
            >
              <Ionicons name="play" size={20} color="#000" />
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => handleContentPress(featuredContent, isMovie ? 'movie' : 'tv')}
            >
              <Ionicons name="information-circle-outline" size={20} color="#fff" />
              <Text style={styles.infoButtonText}>Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Let's Stream</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Search' as never)}
          >
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Ionicons name="person-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderFeaturedContent()}

        {contentCategories.map((category) => {
          const categoryData = categories[category.title] || [];
          return categoryData.length > 0 ? (
            <View key={category.title}>
              {renderCategorySection(
                category.title, 
                categoryData, 
                category.type
              )}
            </View>
          ) : null;
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E50914',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
  },
  featuredContainer: {
    width: '100%',
    height: 500,
    position: 'relative',
    marginBottom: 20,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'rgba(18, 18, 18, 0)',
    backgroundImage: 'linear-gradient(to bottom, rgba(18, 18, 18, 0), rgba(18, 18, 18, 1))',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featuredYear: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  featuredOverview: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 12,
  },
  featuredButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  infoButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  categorySection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  contentList: {
    paddingRight: 16,
  },
  contentItem: {
    marginRight: 10,
    width: 120,
  },
  posterContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 6,
  },
  ratingBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentTitle: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 4,
    width: 120,
  },
});

export default HomeScreen;