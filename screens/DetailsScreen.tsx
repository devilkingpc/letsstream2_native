import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// TMDB API constants
const API_KEY = '297f1b91919bae59d50ed815f8d2e14c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  vote_count?: number;
};

type TvShow = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  first_air_date: string;
  genres?: { id: number; name: string }[];
  episode_run_time?: number[];
  number_of_seasons?: number;
  vote_count?: number;
};

type RouteParams = {
  id: number;
  type: 'movie' | 'tv';
  content?: Movie | TvShow;
};

// videoSources now imported from constants
import { videoSources } from '../constants/videoSources';

const DetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, type, content: initialContent } = route.params as RouteParams;

  const [content, setContent] = useState<Movie | TvShow | null>(initialContent || null);
  const [isLoading, setIsLoading] = useState(!initialContent);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [tvDetails, setTvDetails] = useState<{
    seasons: { season_number: number, episode_count: number }[],
    episodes: { episode_number: number, name: string, still_path: string, overview: string }[]
  }>({ seasons: [], episodes: [] });

  useEffect(() => {
    if (!initialContent) {
      fetchContentDetails();
    }
    
    if (type === 'tv') {
      fetchTvDetails();
    }
  }, [id, type]);

  const fetchContentDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
      );
      const data = await response.json();
      setContent(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching content details:', error);
      setIsLoading(false);
    }
  };

  const fetchTvDetails = async () => {
    try {
      // Get TV show details including seasons
      const tvResponse = await fetch(
        `${BASE_URL}/tv/${id}?api_key=${API_KEY}`
      );
      const tvData = await tvResponse.json();
      
      // Get episodes for the first season by default
      const episodesResponse = await fetch(
        `${BASE_URL}/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`
      );
      const episodesData = await episodesResponse.json();
      
      setTvDetails({
        seasons: tvData.seasons?.map((season: any) => ({
          season_number: season.season_number,
          episode_count: season.episode_count
        })) || [],
        episodes: episodesData.episodes || []
      });
    } catch (error) {
      console.error('Error fetching TV details:', error);
    }
  };

  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1); // Reset to first episode when season changes
    
    try {
      const episodesResponse = await fetch(
        `${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`
      );
      const episodesData = await episodesResponse.json();
      
      setTvDetails(prev => ({
        ...prev,
        episodes: episodesData.episodes || []
      }));
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  const handlePlayContent = () => {
    // Default to first video source
    const defaultSource = videoSources[0];
    
    if (type === 'movie') {
      navigation.navigate('Player' as never, {
        id,
        type,
        title: (content as Movie)?.title,
        sourceUrl: defaultSource.movieUrlPattern.replace('{id}', id.toString()),
        sources: videoSources
      } as never);
    } else {
      navigation.navigate('Player' as never, {
        id,
        type,
        title: (content as TvShow)?.name,
        season: selectedSeason,
        episode: selectedEpisode,
        sourceUrl: defaultSource.tvUrlPattern
          .replace('{id}', id.toString())
          .replace('{season}', selectedSeason.toString())
          .replace('{episode}', selectedEpisode.toString()),
        seasonsData: tvDetails.seasons,
        sources: videoSources
      } as never);
    }
  };

  const handleEpisodePress = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
  };

  if (isLoading || !content) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  // Check if content is movie or TV show
  const isMovie = type === 'movie';
  const title = isMovie ? (content as Movie).title : (content as TvShow).name;
  const releaseDate = isMovie 
    ? (content as Movie).release_date 
    : (content as TvShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const runtime = isMovie 
    ? (content as Movie).runtime 
    : (content as TvShow).episode_run_time?.[0];
  const genres = content.genres || [];

  // Calculate human-readable runtime
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const renderEpisodes = () => {
    if (type !== 'tv' || tvDetails.episodes.length === 0) return null;
    
    return (
      <View style={styles.episodesContainer}>
        <Text style={styles.sectionTitle}>Episodes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.seasonsScrollView}>
          {tvDetails.seasons.filter(s => s.season_number > 0).map(season => (
            <TouchableOpacity 
              key={`season-${season.season_number}`}
              style={[
                styles.seasonButton,
                selectedSeason === season.season_number && styles.selectedSeasonButton
              ]}
              onPress={() => handleSeasonChange(season.season_number)}
            >
              <Text 
                style={[
                  styles.seasonButtonText,
                  selectedSeason === season.season_number && styles.selectedSeasonButtonText
                ]}
              >
                Season {season.season_number}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.episodesList}>
          {tvDetails.episodes.map(episode => (
            <TouchableOpacity 
              key={`episode-${episode.episode_number}`}
              style={[
                styles.episodeItem,
                selectedEpisode === episode.episode_number && styles.selectedEpisodeItem
              ]}
              onPress={() => handleEpisodePress(episode.episode_number)}
            >
              <View style={styles.episodeNumberContainer}>
                <Text style={styles.episodeNumber}>{episode.episode_number}</Text>
              </View>
              <View style={styles.episodeImageContainer}>
                {episode.still_path ? (
                  <Image 
                    source={ episode.still_path ? { uri: `${IMAGE_BASE_URL}${episode.still_path}` } : undefined }
                    style={styles.episodeImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.episodeImagePlaceholder}>
                    <Ionicons name="image-outline" size={24} color="#aaa" />
                  </View>
                )}
              </View>
              <View style={styles.episodeInfo}>
                <Text style={styles.episodeTitle} numberOfLines={2}>
                  {episode.name}
                </Text>
                <Text style={styles.episodeOverview} numberOfLines={2}>
                  {episode.overview}
                </Text>
              </View>
              <Ionicons 
                name="play-circle-outline" 
                size={32} 
                color="#E50914" 
                style={styles.episodePlayIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        {/* Backdrop Image */}
        <View style={styles.backdropContainer}>
          <Image
            source={ content.backdrop_path ? { uri: `${BACKDROP_IMAGE_BASE_URL}${content.backdrop_path}` } : undefined }
            style={styles.backdropImage}
            resizeMode="cover"
          />
          <View style={styles.backdropGradient} />
        </View>
        
        {/* Content Basics */}
        <View style={styles.contentBasics}>
          <Image
            source={ content.poster_path ? { uri: `${IMAGE_BASE_URL}${content.poster_path}` } : undefined }
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.basicInfo}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.year}>{year}</Text>
              {runtime && (
                <>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.runtime}>{formatRuntime(runtime)}</Text>
                </>
              )}
              <Text style={styles.dot}>•</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>
                  {content.vote_average?.toFixed(1)} ({content.vote_count} votes)
                </Text>
              </View>
            </View>
            
            <View style={styles.genreContainer}>
              {genres.map(genre => (
                <View key={genre.id} style={styles.genreBadge}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayContent}
            >
              <Ionicons name="play" size={20} color="#000" />
              <Text style={styles.playButtonText}>
                {isMovie ? 'Play Movie' : `Play S${selectedSeason}:E${selectedEpisode}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Overview */}
        <View style={styles.overviewContainer}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.overview}>{content.overview}</Text>
        </View>
        
        {/* Episodes for TV Shows */}
        {!isMovie && renderEpisodes()}
        
        {/* More Info (could be expanded later) */}
        <View style={styles.moreInfoContainer}>
          <Text style={styles.sectionTitle}>More Info</Text>
          <View style={styles.moreInfoRow}>
            <MaterialIcons name="live-tv" size={18} color="#aaa" />
            <Text style={styles.moreInfoText}>
              {isMovie ? 'Movie' : `TV Series (${(content as TvShow).number_of_seasons} Seasons)`}
            </Text>
          </View>
          
          <View style={styles.moreInfoRow}>
            <MaterialIcons name="date-range" size={18} color="#aaa" />
            <Text style={styles.moreInfoText}>
              Released: {new Date(releaseDate || '').toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.sourceRow}>
            <Text style={styles.sourceNote}>
              Content sources provided by external services. Quality may vary.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

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
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backdropContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    backgroundColor: 'rgba(18, 18, 18, 0)',
    backgroundImage: 'linear-gradient(to bottom, rgba(18, 18, 18, 0), rgba(18, 18, 18, 1))',
  },
  contentBasics: {
    flexDirection: 'row',
    padding: 16,
    marginTop: -60,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  basicInfo: {
    flex: 1,
    marginLeft: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  year: {
    fontSize: 14,
    color: '#aaa',
  },
  dot: {
    fontSize: 14,
    color: '#aaa',
    marginHorizontal: 4,
  },
  runtime: {
    fontSize: 14,
    color: '#aaa',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 4,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  genreBadge: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  overviewContainer: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overview: {
    fontSize: 15,
    color: '#ddd',
    lineHeight: 22,
  },
  episodesContainer: {
    padding: 16,
    paddingTop: 8,
  },
  seasonsScrollView: {
    marginBottom: 16,
  },
  seasonButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
    marginRight: 8,
  },
  selectedSeasonButton: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  seasonButtonText: {
    color: '#ddd',
    fontSize: 14,
  },
  selectedSeasonButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  episodesList: {
    marginTop: 8,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  selectedEpisodeItem: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
  },
  episodeNumberContainer: {
    width: 30,
    alignItems: 'center',
  },
  episodeNumber: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  episodeImageContainer: {
    width: 120,
    height: 68,
    marginRight: 12,
    borderRadius: 4,
    overflow: 'hidden',
  },
  episodeImage: {
    width: '100%',
    height: '100%',
  },
  episodeImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeInfo: {
    flex: 1,
    marginRight: 8,
  },
  episodeTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  episodeOverview: {
    fontSize: 12,
    color: '#aaa',
  },
  episodePlayIcon: {
    marginLeft: 'auto',
  },
  moreInfoContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  moreInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  moreInfoText: {
    color: '#aaa',
    fontSize: 14,
    marginLeft: 8,
  },
  sourceRow: {
    marginTop: 24,
    padding: 12,
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
    borderRadius: 8,
  },
  sourceNote: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default DetailsScreen;