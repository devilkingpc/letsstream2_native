import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Movie, TvShow, ContentType } from '../../../types/content';
import { RootStackParamList } from '../../../types/navigation';
import { VideoSource, fetchVideoSources } from '../../../constants/videoSources';

type ContentInfoProps = {
  content: Movie | TvShow;
  type: ContentType;
};

const ContentInfo: React.FC<ContentInfoProps> = ({
  content,
  type,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);

  const title = type === 'movie' ? (content as Movie).title : (content as TvShow).name;
  const year = new Date(
    type === 'movie' 
      ? (content as Movie).release_date 
      : (content as TvShow).first_air_date
  ).getFullYear().toString();
  const runtime = type === 'movie' ? `${(content as Movie).runtime}m` : undefined;

  useEffect(() => {
    loadVideoSources();
  }, []);

  const loadVideoSources = async () => {
    setIsLoadingSources(true);
    try {
      const sources = await fetchVideoSources();
      setVideoSources(sources);
    } catch (error) {
      console.error('Error loading video sources:', error);
    } finally {
      setIsLoadingSources(false);
    }
  };

  const handlePlayPress = () => {
    if (videoSources.length === 0) {
      return;
    }

    const defaultSource = videoSources[0];
    const sourceUrl = type === 'movie'
      ? defaultSource.movieUrlPattern.replace('{id}', content.id.toString())
      : defaultSource.tvUrlPattern
          .replace('{id}', content.id.toString())
          .replace('{season}', '1')
          .replace('{episode}', '1');

    navigation.navigate('Player', {
      id: content.id,
      type,
      title,
      sourceUrl,
      sources: videoSources,
      ...(type === 'tv' && {
        season: 1,
        episode: 1,
        seasonsData: (content as TvShow).seasons?.map(season => ({
          season_number: season.season_number,
          episode_count: season.episode_count
        })) || []
      })
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.year}>{year}</Text>
        {runtime && (
          <>
            <Text style={styles.bullet}> • </Text>
            <Text style={styles.runtime}>{runtime}</Text>
          </>
        )}
        <Text style={styles.bullet}> • </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{content.vote_average.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.genresContainer}>
        {content.genres?.map((genre) => (
          <View key={genre.id} style={styles.genreTag}>
            <Text style={styles.genreText}>{genre.name}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity 
        style={[
          styles.playButton,
          isLoadingSources && styles.playButtonDisabled
        ]}
        onPress={handlePlayPress}
        disabled={isLoadingSources || videoSources.length === 0}
        activeOpacity={0.7}
      >
        {isLoadingSources ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Ionicons name="play" size={24} color="#000" />
            <Text style={styles.playButtonText}>Play</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  year: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  bullet: {
    color: '#CCCCCC',
    fontSize: 14,
    marginHorizontal: 4,
  },
  runtime: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  rating: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '600',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  playButtonDisabled: {
    opacity: 0.7,
  },
  playButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ContentInfo;
