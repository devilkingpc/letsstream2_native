import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from 'react-native';
import { ContentPoster } from '../components/ContentPoster';
import { HeaderBackButton } from '../components/HeaderBackButton';
import ContentInfo from '../components/screens/details/ContentInfo';
import MoreInfo from '../components/screens/details/MoreInfo';
import Overview from '../components/screens/details/Overview';
import RecommendedContent from '../components/screens/details/RecommendedContent';
import { EpisodesList, SeasonControls } from '../components/screens/details/TvShowEpisodes';
import { Movie, TvShow, ContentType, API_KEY, BASE_URL, IMAGE_BASE_URL, BACKDROP_IMAGE_BASE_URL } from '../types/content';
import { VideoSource, fetchVideoSources } from '../constants/videoSources';

type RouteParams = {
  id: number;
  type: ContentType;
  content?: Movie | TvShow;
};

const formatRuntime = (minutes?: number) => {
  if (!minutes) return '';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
};

const DetailsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
  const { id, type, content: initialContent } = route.params;

  const [content, setContent] = useState<Movie | TvShow | null>(initialContent || null);
  const [isLoading, setIsLoading] = useState(!initialContent);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [tvDetails, setTvDetails] = useState<{
    seasons: { season_number: number, episode_count: number }[],
    episodes: { episode_number: number, name: string, still_path: string, overview: string }[]
  }>({ seasons: [], episodes: [] });
  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sources, contentData] = await Promise.all([
          fetchVideoSources(),
          !initialContent ? fetchContentDetails() : Promise.resolve(null)
        ]);
        
        setVideoSources(sources);
        if (contentData) {
          setContent(contentData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoadingSources(false);
        setIsLoading(false);
      }
    };
    
    loadData();
    if (type === 'tv') {
      fetchTvDetails();
    }
  }, [id, type]);

  const fetchContentDetails = async () => {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch content details');
    }
    return response.json();
  };

  const fetchTvDetails = async () => {
    try {
      const [tvResponse, episodesResponse] = await Promise.all([
        fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`),
        fetch(`${BASE_URL}/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`)
      ]);

      const [tvData, episodesData] = await Promise.all([
        tvResponse.json(),
        episodesResponse.json()
      ]);
      
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
    setSelectedEpisode(1);
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
    if (isLoadingSources) {
      console.warn('Video sources are still loading...');
      return;
    }

    const defaultSource = videoSources[0];
    if (!defaultSource) {
      console.warn('No video sources available');
      return;
    }

    if (type === 'movie') {
      const movieUrl = defaultSource.movieUrlPattern
        ? defaultSource.movieUrlPattern.replace('{id}', id.toString())
        : '';
      
      if (!movieUrl) {
        console.warn('Invalid movie URL pattern');
        return;
      }

      navigation.navigate('Player', {
        id,
        type,
        title: (content as Movie)?.title || 'Untitled',
        sourceUrl: movieUrl,
        sources: videoSources
      });
    } else {
      const tvUrl = defaultSource.tvUrlPattern
        ? defaultSource.tvUrlPattern
            .replace('{id}', id.toString())
            .replace('{season}', selectedSeason.toString())
            .replace('{episode}', selectedEpisode.toString())
        : '';

      if (!tvUrl) {
        console.warn('Invalid TV URL pattern');
        return;
      }

      navigation.navigate('Player', {
        id,
        type,
        title: (content as TvShow)?.name || 'Untitled',
        season: selectedSeason,
        episode: selectedEpisode,
        sourceUrl: tvUrl,
        seasonsData: tvDetails.seasons,
        sources: videoSources
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!content) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Content not found</Text>
      </View>
    );
  }

  const title = type === 'movie' ? (content as Movie).title : (content as TvShow).name;
  const backdropPath = content.backdrop_path
    ? `${BACKDROP_IMAGE_BASE_URL}${content.backdrop_path}`
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} bounces={false}>
        <View style={styles.headerContainer}>
          {backdropPath && (
            <Image
              source={{ uri: backdropPath }}
              style={styles.backdropImage}
              resizeMode="cover"
            />
          )}
          <LinearGradient
            colors={['transparent', '#0A0A0A']}
            style={styles.gradient}
          />
          <HeaderBackButton style={styles.backButton} />
        </View>

        <View style={styles.contentContainer}>
          <ContentInfo content={content} type={type} />
          <Overview overview={content.overview} />
          
          {type === 'tv' && (
            <>
              <SeasonControls
                seasons={tvDetails.seasons}
                selectedSeason={selectedSeason}
                onSeasonChange={setSelectedSeason}
              />
              <EpisodesList
                episodes={tvDetails.episodes}
                onEpisodeSelect={setSelectedEpisode}
                selectedEpisode={selectedEpisode}
                videoSources={videoSources}
                isLoadingSources={isLoadingSources}
                navigation={navigation}
                contentId={id}
              />
            </>
          )}

          <MoreInfo
            content={content}
            type={type}
            runtime={type === 'movie' ? formatRuntime((content as Movie).runtime) : undefined}
          />

          <RecommendedContent contentId={id} contentType={type} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  headerContainer: {
    height: 300,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  contentContainer: {
    flex: 1,
    marginTop: -40,
  },
});

export default DetailsScreen;